import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const prisma = new PrismaClient();

import admin from "firebase-admin";

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "venueflow-mock",
  });
}
const firestore = admin.firestore();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  // Sync function for Firestore
  async function syncToFirebase(updatedZones) {
    try {
      const batch = firestore.batch();
      updatedZones.forEach(zone => {
        const docRef = firestore.collection("zones").doc(zone.id);
        batch.set(docRef, {
          ...zone,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      });
      await batch.commit();
      console.log("Synced to Firestore successfully");
    } catch (error) {
      console.error("Firestore sync error:", error);
    }
  }

  // Simulation logic
  async function runSimulation() {
    console.log("Running crowd simulation step...");
    const zones = await prisma.venueZone.findMany();
    
    for (const zone of zones) {
      // Randomly fluctuate density by +/- 5%
      const delta = Math.floor(Math.random() * 11) - 5;
      let newDensity = Math.max(0, Math.min(100, zone.currentDensity + delta));
      
      // Auto-update status based on density
      let status = "normal";
      if (newDensity > 90) status = "restricted";
      else if (newDensity > 70) status = "congested";

      await prisma.venueZone.update({
        where: { id: zone.id },
        data: { currentDensity: newDensity, status }
      });

      // Update wait times
      if (['food', 'restroom', 'merch', 'gate'].includes(zone.type)) {
        await prisma.waitTime.create({
          data: {
            zoneId: zone.id,
            estimatedWaitMinutes: Math.floor(newDensity / 10),
          }
        });
      }
    }

    // Broadcast update via Socket.io
    const updatedZones = await prisma.venueZone.findMany({
      include: {
        waitTimes: {
          orderBy: { lastUpdated: 'desc' },
          take: 1
        }
      }
    });
    
    // Sync to Firestore for real-time storage
    await syncToFirebase(updatedZones);

    io.emit("zonesUpdated", updatedZones);
  }

  // Run simulation every 10 seconds
  setInterval(runSimulation, 10000);

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
