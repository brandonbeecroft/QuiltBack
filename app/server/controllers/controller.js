

module.exports ={
    getPosts:(req,res)=>{
        if (!req.user){
            console.log("UNKNOWN user");
            return res.status(404).send('User not found');
        }
        else{
            req.app.get("db").getAllPosts()
                   .then(response=>{
                       res.status(200).json(response);
                   })
                   .catch(err=>{
                       res.status(500).end();
                   })
        }
    },
       getEvents:(req,res)=>{
        if (!req.user){
            console.log("UNKNOWN user");
            return res.status(404).send('User not found');
        }
        else{
           
            req.app.get("db").tables.map(table =>console.log("TABLE "  + table.name) );
           
            req.app.get("db").getAllEvents()
                   .then(response=>{
                       res.status(200).json(response);
                   })
                   .catch(err=>{
                       res.status(500).end();
                   })
        }
    }




}