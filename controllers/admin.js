const getAllProfiles = async (req, res) => {
  res.send("test i get all profile");
};

const getProfilesById = async (req, res) => {
  res.send("test get profile by id");
};
const deleteProfileById = async (req,res) =>{
    res.send("test delete by id")
}

module.exports = { getAllProfiles, getProfilesById, deleteProfileById };
