const express = require("express");
const axios = require("axios");
const app = express();
const port = 3030
const NodeCache = require("node-cache");

const cache = new NodeCache();

app.get("/", (req, res) => {
  return res.json({ message: "Hello world node-cache" });
});


app.get("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const timeOfCache = 100 //seconds

      let getCache = cache.get(id) 

      if(getCache !== undefined) {
          console.log('found cache id: ' + id)
          return res.status(200).json(getCache);

      }else {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/todos/${id}`);
        let statusCache = cache.set(id, data, timeOfCache)

        console.log('Add cache id :' + id + ' status : ' , statusCache) 

        res.status(200).json(data)
      }

    } catch (err) {
        console.log(`error :  ${err.message}`)
        return res.status(500)
    }
  });

app.listen(port, () => {
    console.log(`server runing on port ${port}`)
})