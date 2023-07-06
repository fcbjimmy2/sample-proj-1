const config = require("../config");
const express = require("express");
const router = express.Router();
const sql = require("msnodesqlv8");

router.get("/contacts", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let teacher_pf;
  const userBranchCodes = req.session.branchcode.split(",");
  function get_all_teachers() {
    // let's show me everything
    let query =
      "select * from [User] where [role]=? and Active=? order by BranchCode";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, ["Teacher", 1], (error, results) => {
          if (!error) {
            console.log(results);
            teacher_pf = results.filter((item) => {
              if (item.BranchCode !== null) {
                const userBranch = item.BranchCode.split(",");
                if (
                  userBranch.some((branch) => userBranchCodes.includes(branch))
                )
                  return item;
              }
            });
            if (config.debug) {
              console.log("data return : " + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }

  await get_all_teachers();

  res.render("teachers.ejs", {
    config: config,
    req: req,
    teacher_pf: teacher_pf,
  });
});

module.exports = router;
