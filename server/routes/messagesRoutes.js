const {
  sendMessage,
  getAllMesage,
} = require("../controllers/messagesController");
const router = require("express").Router();

router.post("/addMsg", sendMessage);
router.post("/getMsg", getAllMesage);

module.exports = router;
