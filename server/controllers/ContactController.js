const User = require("../models/UserModel");

const SearchedContacts = async (req, res, next) => {
    try {
        const {searchTerm} = req.body;
        if(searchTerm.length <= 0){
            return res.status(400).json({
                success: false,
                message: "Search term is required"
            })
        }
        const sanitizedSearchTerm = searchTerm.replace(
            /[++?^{{}{} [[\]\\]/g,
            "\\$&"
        );
        const regex = new RegExp(sanitizedSearchTerm, "i");
        const contacts = await User.find({
            $and: [{ _id: { $ne: req.userId } }, 
            { $or: [{firstName: regex}, {lastName: regex}, {email: regex}]}
            ],
        });

        res.status(200).json({
            success: true,
            contacts
        })
    } catch (error) {
      
    }
  }

  module.exports = {SearchedContacts}