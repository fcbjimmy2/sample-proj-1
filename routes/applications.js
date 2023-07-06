const config = require("../config");
const express = require("express");
const router = express.Router();
const sql = require("msnodesqlv8");
const fs = require("fs");

router.get("/leaves", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  let lapps;

  function get_leaves_app() {
    let query = "EXEC [sp_LeaveApp_Get] @Approver=?";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(
          config.db,
          query,
          [req.session.usercode],
          (error, results) => {
            if (!error) {
              lapps = results;
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

  await get_leaves_app();
  res.render("app_leaves", {
    config: config,
    req: req,
    lapps: lapps,
  });
});

router.post("/leaves", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;
  let applicant = req.body.applicant;

  if (action === "get_affected") {
    function get_leaves_app() {
      let query = "Select * FROM [EForm_LeaveApplication] where [RefNo]=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.ref], (error, results) => {
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

    await get_leaves_app();
  }

  if (action === "update_leave") {
    let message =
      "Leave Application Ref:" + req.body.ref + " has been " + req.body.sts;

    function update_leave() {
      let query =
        "Update [EForm_LeaveApplication] set [Status]=?,[RejectReason]=?,[Approver]=?,[ApproverName]=?,[ApproveDate]=? where [RefNo]=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.sts,
              req.body.remarks,
              req.session.usercode,
              req.session.user,
              new Date(),
              req.body.ref,
            ],
            (error, results) => {
              if (!error) {
                // return_data = results;
                if (config.debug) {
                  //    console.log("data return : " + JSON.stringify(results));
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

    function get_leaves_app() {
      let query = "EXEC [sp_LeaveApp_Get] @Approver=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.session.usercode],
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

    function send_msg() {
      let query =
        "EXEC sp_User_InboxMessage_Send @UserCode=?, @TargetUser=?, @Message=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.session.usercode, applicant, message],
            (error, results) => {
              if (!error) {
                // return_Data = results;
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }

    await update_leave();
    await get_leaves_app();
    if (applicant !== req.session.usercode) {
      // not myself
      await send_msg();
    }
  }

  if (action === "get_report") {
    function get_report() {
      let query =
        "EXEC [sp_Rpt_Get_LeaveApp] @branchcode=?,@DateFrom=?, @DateTo=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.branchcode, req.body.start_date, req.body.end_date],
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

    await get_report();
  }

  res.send(return_data);
});

router.get("/claims", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let capps;

  function get_claims_app() {
    let query = "EXEC [sp_ExpensesClaim_Get] @Approver=?";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(
          config.db,
          query,
          [req.session.usercode],
          (error, results) => {
            if (!error) {
              capps = results;
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

  await get_claims_app();
  res.render("app_claims", {
    config: config,
    req: req,
    capps: capps,
  });
});

router.post("/claims", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;
  let applicant = req.body.applicant;
  let message = "Claim Ref:" + req.body.ref + " has been " + req.body.sts;

  if (action === "get_claim_item") {
    function get_claim_item() {
      let query =
        "SELECT [EForm_ExpensesClaim].[id],[RefNo] ,[Applicant],[ApplicantName],[BranchCode],[AppliedDate],[Remarks],[TotalAmount]" +
        "      ,[TotalClaimAmount],[Status],[Approver],[ApproverName],[ApproveDate],[RejectReason],[LinkCode],[TempId],[ExpensesType],[Details],[Amount]" +
        "  FROM [EForm_ExpensesClaim] left join EForm_ExpensesClaim_Details on EForm_ExpensesClaim_Details.AppId = [EForm_ExpensesClaim].id" +
        " where Status = 'Pending' and RefNo=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.ref], (error, results) => {
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

    await get_claim_item();
  }

  if (action === "update_claim") {
    function update_claim() {
      let query =
        "Update [EForm_ExpensesClaim] set [Status]=?,[RejectReason]=?,[Approver]=?,[ApproverName]=?,[ApproveDate]=? where [RefNo]=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.sts,
              req.body.remarks,
              req.session.usercode,
              req.session.user,
              new Date(),
              req.body.ref,
            ],
            (error, results) => {
              if (!error) {
                // return_data = results;
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

    function get_claim_list() {
      let query = "EXEC [sp_ExpensesClaim_Get] @Approver=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.session.usercode],
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

    function send_msg() {
      let query =
        "EXEC sp_User_InboxMessage_Send @UserCode=?, @TargetUser=?, @Message=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.session.usercode, applicant, message],
            (error, results) => {
              if (!error) {
                // return_Data = results;
                resolve();
              } else {
                console.log(error);
              }
            }
          );
        }, 10); //1/10 sec
      });
    }

    await update_claim();
    await get_claim_list();
    if (applicant !== req.session.usercode) {
      // not myself
      await send_msg();
    }
  }

  if (action === "get_report") {
    function get_report() {
      let query =
        "EXEC [sp_Rpt_Get_ExpensesClaim] @branchcode=?,@DateFrom=?, @DateTo=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.branchcode, req.body.start_date, req.body.end_date],
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

    await get_report();
  }

  res.send(return_data);
});

router.get("/payrolls", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  res.render("app_payrolls", {
    config: config,
    req: req,
  });
});

router.post("/payrolls", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let action = req.body.action;
  let return_data;
  if (action === "get_report") {
    function get_report() {
      let query = "EXEC [sc_User_Salary_full] @date1=?, @date2=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.start_date, req.body.end_date],
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

    if (req.body.start_date && req.body.end_date) {
      await get_report();
    }
  }
  res.send(return_data);
});

module.exports = router;
