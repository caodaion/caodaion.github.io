const express = require("express");
const router = express.Router();
const webpush = require("web-push");
// console.log(webpush.generateVAPIDKeys());

const vapidKeys = {
  publicKey:
    "BOVH41pe57AnjbYpRvEOrJvyo9eGeOkfyCVPvBnvS8KF4IG9Wo6NsEubLzrXbeEz1ihntSxRWh0qOxrdhaWo_I4",
  privateKey: "ah1QuF2LEve1XyaQkqLWrtLfm7qULBbfZJ6L4uBEC4s",
};

// get client subscription config from db
// const subscription = {
//   endpoint:
//     "https://fcm.googleapis.com/fcm/send/f2uXl0a14RY:APA91bE94HED26kU5bJ_gW0quCZzHf3AO_yNJvWfpBywW5B0zicDtUpiYqh1iV3383WlnitCTMQVvDVpf4XT5s22aFPDIhDFPADTjxo3BzMOOYc86dox7EihHJ-o6tdHynCSRaijt2KL",
//   expirationTime: null,
//   keys: {
//     p256dh:
//       "BO0SLOpxkoLVJaON2qwIwoe_UD3RnCGV5N9jdb-TgTYF1TT0MWlWADFD5M4LVroVVCGpfBIge7-KQjGl2bT1rdw",
//     auth: "Vu_fbk7LNvdEIdeDLq841A",
//   },
// };

// const payload = {
//   notification: {
//     title: "Title",
//     body: "This is my body",
//     icon: "assets/icons/icon-384x384.png",
//     actions: [
//       { action: "bar", title: "Focus last" },
//       { action: "baz", title: "Navigate last" },
//     ],
//     data: {
//       onActionClick: {
//         default: { operation: "openWindow" },
//         bar: {
//           operation: "focusLastFocusedOrOpen",
//           url: "/signin",
//         },
//         baz: {
//           operation: "navigateLastFocusedOrOpen",
//           url: "/signin",
//         },
//       },
//     },
//   },
// };

// const options = {
//   vapidDetails: {
//     subject: "mailto:example_email@example.com",
//     publicKey: vapidKeys.publicKey,
//     privateKey: vapidKeys.privateKey,
//   },
//   TTL: 60,
// };

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", (req, res, next) => {
  res.send(`Welcome to push site`);
  next();
});

router.get("/subscribe", (req, res, next) => {
  res.send(req.body || "The subscription was not approved");
  next();
});

router.post("/send", (req, res, next) => {
  const subscription = req?.body?.subscription;
  const payload = req?.body?.payload;
  const options = {
    vapidDetails: {
      subject: req?.body?.options?.vapidDetails?.subject ? req?.body?.options?.vapidDetails?.subject : "mailto:example_email@example.com",
      publicKey: vapidKeys.publicKey,
      privateKey: vapidKeys.privateKey,
    },
    TTL: 60,
  };
  // // send notification
  webpush
    .sendNotification(subscription, JSON.stringify(payload), options)
    .then((_) => {
      console.log("SENT!!!");
      console.log(_);
      res.json(_)
    })
    .catch((_) => {
      console.log(_);
      res.json(_)
    });
});

// send notification
// webpush.sendNotification(subscription, JSON.stringify(payload), options)
//   .then((_) => {
//       console.log('SENT!!!');
//       console.log(_);
//   })
//   .catch((_) => {
//       console.log(_);
//   });
module.exports = router;
