const urlVersioning = (version) => (req,res,next) => {
    console.log(`URL Versioning Debug: req.path = "${req.path}", checking if it starts with "/${version}"`);
    if(req.path.startsWith(`/${version}`)){
        console.log(`URL Versioning: Path "${req.path}" is valid for version "${version}"`);
        next();
    }else{
        console.log(`URL Versioning: Path "${req.path}" is NOT valid for version "${version}"`);
        res.status(404).json({
            success:false,
            error:"API version is not supported",
        });
    }
}

const headerVersioning = (version) => (req, res, next)=>{
    if(req.get("Accept-Version") === version){
        next();
    }else{
        res.status(404).json({
            success:false,
            error:"API version is not supported",
        });
    }
}

const contentTypeVersioning = (version) => (req, res, next)=>{
    const contentType = req.get("Content-Type");

  if (
    contentType &&
    contentType.includes(`application/vnd.api.${version}+json`)
  ) {
    next();
  } else {
    res.status(404).json({
      success: false,
      error: "API version is not supported",
    });
  }
};

module.exports = {urlVersioning, headerVersioning, contentTypeVersioning};