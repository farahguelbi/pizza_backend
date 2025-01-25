const Side=require('../models/sides');
//get side by id 
exports.getSideById=async(req,res)=>{
    try{
        const side=await Side.findById(req.params.id);
        if(!side){
            return res.status(404).send('Side not found!');
        }
        res.status(200).json(side);
    }catch(err){
        res.status(500).send(err.message);
    }
};
// Get all sides
exports.getAllSides = async (req, res) => {
    try {
      const sides = await Side.find();
      res.status(200).json(sides);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };