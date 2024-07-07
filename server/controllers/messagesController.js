const Messages = require("../model/messageModel");

module.exports.sendMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ msg: "Message added to database", data });
    } else {
      return res.json({ msg: "Failed to add message to database." });
    }
  } catch (error) {
    next(error);
  }
};
module.exports.getAllMesage = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = await messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.json(projectedMessages);
    // if (!messages) {
    //   return res.json({ msg: "No Messages Yet." });
    // } else {
    //   const pro
    // }
  } catch (error) {
    next(error);
  }
};
