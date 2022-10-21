const mysql = require("mysql")
const db = require("../helpers/database")

module.exports = {
    deleteQRController: (req, res)=> {
      const qrname = req.body.name
//      const qrURL = req.body.url 
//      const description = req.body.description
      const userID = req.body.userID
  
      db.getConnection ( async (err, connection)=> {
        if (err) throw (err)
  
        const sqlSearch = `SELECT * FROM QRCodes 
                           where qrname = ? AND userID = ? LIMIT 1`
        const search_query = mysql.format(sqlSearch, [qrname, userID])
        const sqlDelete = `DELETE FROM QRCodes WHERE qrname = ? AND userID = ?`
        const delete_query = mysql.format(sqlDelete, [qrname, userID])
  
        await connection.query (search_query, async (err, result)=> {
          if (err) throw (err)
          console.log("--------> Search Results")
          console.log(result.length)
          if (result.length == 0) {
            console.log("--------> QR Code does not exist")
            res.sendStatus(409)
          } else {
              await connection.query (delete_query, (err, result)=> {
                connection.release()
                if (err) throw (err)
                console.log("--------> Deleted QR Code")
                //console.log(result.insertId)
                res.sendStatus(201) 
              })
          }
        })
      })
    },
    updateQRController: (req, res)=> {
      const qrname = req.body.name
      const qrURL = req.body.url 
      const description = req.body.description
      const userID = req.body.userID

      const newqrname = req.body.newqrname
      const newqrurl = req.body.newqrurl
      const newqrdes = req.body.newqrdes

      if (newqrname == NULL) {
        newqrname = qrname
      }
      if (newqrurl == NULL) {
        newqrurl = qrURL
      }
      if (newqrdes == NULL) {
        newqrdes = description
      }

      db.getConnection ( async (err, connection)=> {
        if (err) throw (err)
  
        const sqlSearch = `SELECT * FROM QRCodes 
                           where qrname = ? AND userID = ? LIMIT 1`
        const search_query = mysql.format(sqlSearch, [qrname, userID])
        const sqlUpdate = `UPDATE QRCodes SET qrname = newqrname 
                           WHERE qrname = ? AND userID = ?`
        const update_query = mysql.format(sqlUpdate, [qrname, userID, newqrname])
  
        const sqlUpdateUrl = `UPDATE QRCodes SET qrURL = newqrurl 
        WHERE qrname = ? AND userID = ?`
        const update_queryurl = mysql.format(sqlUpdateUrl, [qrname, userID, newqrurl])

        const sqlUpdateDes = `UPDATE QRCodes SET description = newqrdes 
        WHERE qrname = ? AND userID = ?`
        const update_querydes = mysql.format(sqlUpdateDes, [qrname, userID, newqrdes])

        await connection.query (update_query, async (err, result)=> {
          if (err) throw (err)
          console.log("--------> Updated QR Code Name")
          //console.log(result.insertId)
           res.sendStatus(201) 
        }) 

        await connection.query (update_queryurl, async (err, result)=> {
          if (err) throw (err)
            console.log("--------> Updated QR Code URL")
            //console.log(result.insertId)
            res.sendStatus(201) 
        }) 

        await connection.query (update_querydes, async (err, result)=> {
          if (err) throw (err)
          connection.release()
          if (err) throw (err)
          console.log("--------> Updated QR Code Description")
          //console.log(result.insertId)
          res.sendStatus(201) 
        }) 

      })
    }
  }