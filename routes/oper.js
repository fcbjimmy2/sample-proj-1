const config = require("../config");
const express = require("express");
const router = express.Router();
const sql = require("msnodesqlv8");

router.get("/today", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let branch;
  let venue;
  let classes;
  const userBranchCodes = req.session.branchcode.split(",");
  function get_branches() {
    // let's show me everything
    let query = "EXEC [sp_get_Branch]";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            branch = results.filter((item) =>
              userBranchCodes.includes(item.BranchCode)
            );
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

  function get_venues() {
    // let's show me everything
    let query = "EXEC [sp_get_Venue]";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            venue = results;
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

  function get_classes() {
    // let's show me everything
    //console.log(req.query)
    let dd = "";
    let bc = "";
    if (req.query.date) {
      console.log(
        "------------------------------------------  req.query  ------------------------------------------"
      );
      console.log(req.query);
      dd = req.query.date;
    } else {
      dd = new Date().toLocaleDateString("en-CA", { TimeZone: "GMT" });
    }

    let query = "EXEC [sp_get_Class_ByVenue] @date=?";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, [dd, bc], (error, results) => {
          if (!error) {
            classes = results;
            ddd = dd;
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

  await get_branches();
  await get_venues();
  await get_classes();

  res.render("oper.ejs", {
    config: config,
    req: req,
    branch: branch,
    venue: venue,
    classes: classes,
    date: ddd,
  });
});

router.get("/resources", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  let dd = "";
  let bc = "";

  if (req.query.date) {
    dd = req.query.date;
  } else {
    dd = new Date().toLocaleDateString("en-CA", { TimeZone: "GMT" });
  }

  if (req.query.branchcode) {
    bc = req.query.branchcode;
  }

  let branch;

  function get_branches() {
    // let's show me everything
    let query = "EXEC [sp_get_Branch]";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            branch = results;
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

  await get_branches();

  res.render("resources.ejs", {
    config: config,
    req: req,
    branch: branch,
    date: dd,
  });
});

router.post("/resources", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;

  let dd;
  let bc;
  let action = req.body.action;

  if (req.body.date) {
    dd = req.body.date;
  } else {
    dd = new Date().toLocaleDateString("en-CA", { TimeZone: "GMT" });
  }

  if (
    req.body.branchcode !== "" &&
    req.body.branchcode !== null &&
    req.body.branchcode !== undefined
  ) {
    bc = req.body.branchcode;
  } else {
    bc = "*";
  }

  if (action === "all_schedules") {
    function all_schedules() {
      let query =
        "EXEC [sp_get_Class_ByVenue_With2Month] @date=?, @BranchCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [dd, bc], (error, results) => {
            if (!error) {
              return_data = results;
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
    await all_schedules();
  }

  if (action === "all_venues") {
    function all_venues() {
      let query;
      if (bc !== "*") {
        query =
          "Select VenueCode,VenueName,BranchCode FROM [Venue] where Active=1 and BranchCode='" +
          bc +
          "' order by Idx";
      } else {
        query =
          "Select VenueCode,VenueName,BranchCode FROM [Venue] where Active=1 order by Idx";
      }
      if (config.debug) {
        console.log(query);
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data = results;
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
    await all_venues();
  }

  res.send(return_data);
});

router.post("/attend_taking", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;

  if (action === "get_class_for_att_taking") {
    function get_class_for_att() {
      let query = "EXEC [sp_Class_Get] @ClassCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.class_code],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log("data return : " + JSON.stringify(results));
                }
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }

    await get_class_for_att();
  }

  if (action === "att_take") {
    function att_take() {
      let query =
        "EXEC [sp_TeacherClass_TakeAttendance] @ClassCode=?,@StudentCode=?, @Value=?, @UserCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.class_code,
              req.body.student_code,
              req.body.status,
              req.session.usercode,
            ],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log("data return : " + JSON.stringify(results));
                }
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }

    await att_take();
  }

  if (action === "check_all_status") {
    function get_current_class_sts() {
      // let's show me everything
      let query = "EXEC [sp_get_Class_ByVenueLight] @date=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, ["2022-05-03"], (error, results) => {
            if (!error) {
              return_data = results;
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }

    await get_current_class_sts();
  }
  if (action === "show_student") {
    function show_student() {
      let query = "SELECT * FROM [Student] where [StudentCode]=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.student_code],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log("data return : " + JSON.stringify(results));
                }
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }

    await show_student();
  }
  res.send(return_data);
});

router.post("/change_teacher", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;
  if (action === "get_teacher_list") {
    function get_teacher_list() {
      let query = "EXEC [sp_get_AvaliableTeacher]";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data = results;
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

    await get_teacher_list();
  }
  if (action === "change_teacher") {
    function change_teacher() {
      let query =
        "EXEC [sp_Class_ChangeTeacher] @NewTeacherCode=?,@ClassCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.teacher_code, req.body.class_code],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log("data return : " + JSON.stringify(results));
                }
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }

    await change_teacher();
  }
  res.send(return_data);
});

router.post("/class_change", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;
  if (action === "student_class_change") {
    function student_class_change() {
      let query =
        "EXEC [sp_Student_Class_Change] @StudentCode=?,@OrgClassCode=?,@NewClassCode=?,@UserCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.student_code,
              req.body.oc_code,
              req.body.class_code,
              req.session.usercode,
            ],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log("data return : " + JSON.stringify(results));
                }
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }

    await student_class_change();
  }
  res.send(return_data);
});

router.post("/change_sch", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;
  if (action === "change_1sch") {
    function change_sch() {
      let query =
        "EXEC [sp_Class_Change] @ClassCode=?, @NewDate=?,@StartTime=?,@EndTime=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.class_code, req.body.date, req.body.start, req.body.end],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log("data return : " + JSON.stringify(results));
                }
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }
    await change_sch();
  }
  if (action === "change_venue") {
    function change_venue() {
      let query = "EXEC [sp_Class_Change] @ClassCode=?, @NewVenueCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.class_code, req.body.venue],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log("data return : " + JSON.stringify(results));
                }
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }
    await change_venue();
  }
  res.send(return_data);
});

module.exports = router;
