const config = require("../config");
const express = require("express");
const router = express.Router();
const sql = require("msnodesqlv8");

router.get("/invoice", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  const userBranchCodes = req.session.branchcode.split(",");

  function get_all_inv() {
    query = "EXEC [sp_Student_Payment]";
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            return_data = results.filter((item) => {
              return userBranchCodes.includes(item.BranchCode);
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

  await get_all_inv();

  res.render("invoice", {
    config: config,
    req: req,
    return_data,
  });
});

router.post("/invoice", async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let return_data2;
  let action = req.body.action;
  let form = req.body.form;

  if (action === "create_inv") {
    function create_inv() {
      query =
        "[sp100_Product_PrepareInvoice] @StudentCode=?,@UserCode=?,@CartID=?,@Remarks=?";
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
              req.session.usercode,
              req.body.cartid,
              req.body.remarks,
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
    await create_inv();
  }

  if (action === "void_inv") {
    function void_inv() {
      query =
        "EXEC [sp103_Course_PaymentCancel] @InvoiceNo=?,@UserCode=?,@Reason=?,@BranchCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.invoice,
              req.session.usercode,
              req.body.reason,
              req.body.branchcode,
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
    await void_inv();
  }

  if (action === "confirm_invoice") {
    function confirm_invoice() {
      query = "EXEC [sp101_Product_SubmitInvoice] @CartID=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.cartid], (error, results) => {
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
    await confirm_invoice();
  }

  if (action === "upd_inv_remarks") {
    function upd_inv_remarks() {
      let s;
      let parms = form.split("&");
      for (let i = 0; i < parms.length; i++) {
        s = parms[i].split("inv_remarks=")[1];
        if (s !== undefined) {
          inv_remarks = decodeURIComponent(s);
        }
        s = parms[i].split("inv_cartid=")[1];
        if (s !== undefined) {
          inv_cartid = s;
        }
      }
      query = "update [InvoiceHeader] set [Remarks]=? where [CartID]=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [inv_remarks, inv_cartid],
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

    await upd_inv_remarks();
  }

  if (action === "full_list") {
    function full_list() {
      query = "EXEC [sp_Student_Payment]";
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
    await full_list();
  }

  if (action === "get_product_list") {
    function get_voucher_list() {
      query = "select * from [Voucher] where [VoucherType] = 'Voucher'";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data2 = results;
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
    function get_product_list() {
      query = "EXEC [sp_Product_Get] @BranchCode=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.branchcode],
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
    await get_product_list();
    await get_voucher_list();
    for (i = 0; i < return_data2.length; i++) {
      return_data.push({
        ProductCode: return_data2[i].VoucherCode,
        ProductDescription: return_data2[i].VoucherName,
        ProductName: return_data2[i].VoucherName,
        ProductPrice: return_data2[i].Amount,
        Qty: return_data2[i].Qty,
      });
    }
  }

  if (action === "get_report") {
    function get_report() {
      let query =
        "EXEC [sp_Rpt_Get_Transaction] @branchcode=?,@DateFrom=?, @DateTo=?";
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

module.exports = router;
