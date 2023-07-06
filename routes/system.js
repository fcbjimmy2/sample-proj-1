const config = require('../config');
const express = require('express');
const router = express.Router();
const sql = require('msnodesqlv8');

router.get('/vouchers', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  let return_data;

  //if (req.session.userrole==="Admin") {
  function get_allvouchers() {
    let query = 'select * from [Voucher] order by VoucherCode';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, [1], (error, results) => {
          if (!error) {
            return_data = results;
            if (config.debug) {
              console.log('data return : ' + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }

  await get_allvouchers();
  res.render('voucher', {
    config: config,
    req: req,
    return_data: return_data
  });
  //}
});

router.post('/vouchers', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  let return_data;
  let action = req.body.action;
  let form = req.body.form;

  if (action === 'checkdup') {
    function checkdup() {
      let query = 'Select * from [Voucher] where [VoucherCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.vcode], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await checkdup();
  }

  if (action === 'get_voucher_list') {
    function get_voucher_list() {
      let query = 'Select * from [Voucher] order by VoucherCode';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_voucher_list();
  }

  if (action === 'get_rule_list') {
    function get_rule_list() {
      let query = 'Select * from [VoucherCondition] where [VoucherCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.vcode], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_rule_list();
  }

  if (action === 'save_new') {
    let s;
    let amount = 0;
    let discount = 0;
    let parms = form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('voucher_name=')[1];
      if (s !== undefined) {
        voucher_name = decodeURIComponent(s);
      }
      s = parms[i].split('voucher_code=')[1];
      if (s !== undefined) {
        voucher_code = decodeURIComponent(s);
      }
      s = parms[i].split('voucher_type=')[1];
      if (s !== undefined) {
        voucher_type = decodeURIComponent(s);
      }
      s = parms[i].split('qty=')[1];
      if (s !== undefined) {
        qty = s;
      }
      s = parms[i].split('amount=')[1];
      if (s !== undefined) {
        amount = s;
      }
      s = parms[i].split('discount=')[1];
      if (s !== undefined) {
        discount = s;
      }
      s = parms[i].split('validity=')[1];
      if (s !== undefined) {
        validity = s;
      }
      s = parms[i].split('quota=')[1];
      if (s !== undefined) {
        quota = s;
      }
      s = parms[i].split('start_date=')[1];
      if (s !== undefined) {
        start_date = s;
      }
      s = parms[i].split('end_date=')[1];
      if (s !== undefined) {
        end_date = s;
      }
    }

    function save_new() {
      let query =
        'insert into [Voucher] ([VoucherCode],[VoucherName],[VoucherType],[Qty],' +
        '[Amount],[Discount],[Validity],[VoucherStart],[VoucherEnd],[Quota]) values(?,?,?,?,?,?,?,?,?,?)';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [voucher_code, voucher_name, voucher_type, qty, amount, discount, validity, start_date, end_date, quota],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await save_new();
  }

  if (action === 'save_new_rule') {
    function save_new_rule() {
      let query =
        'insert into [VoucherCondition] ([VoucherCode],[Description],[isNewMember],[QtyCond],[CourseQtyCond],[WeekQtyCond],[MonthQtyCond],[CourseCode],[CourseMasterCode],[ProductCode])' +
        ' values(?,?,?,?,?,?,?,?,?,?)';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.rule_vcode,
              req.body.rule_description,
              req.body.rule_isnewmember,
              req.body.rule_qtycond,
              req.body.rule_qtycoursecond,
              req.body.rule_weekqtycond,
              req.body.rule_monthqtycond,
              req.body.rule_coursecode,
              req.body.rule_mastercode,
              req.body.rule_productcode
            ],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await save_new_rule();
  }

  if (action === 'update_voucher') {
    let s;
    let amount = 0;
    let discount = 0;
    let parms = form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('voucher_name=')[1];
      if (s !== undefined) {
        voucher_name = decodeURIComponent(s);
      }
      s = parms[i].split('voucher_code=')[1];
      if (s !== undefined) {
        voucher_code = decodeURIComponent(s);
      }
      s = parms[i].split('voucher_type=')[1];
      if (s !== undefined) {
        voucher_type = decodeURIComponent(s);
      }
      s = parms[i].split('qty=')[1];
      if (s !== undefined) {
        qty = s;
      }
      s = parms[i].split('amount=')[1];
      if (s !== undefined) {
        amount = s;
      }
      s = parms[i].split('discount=')[1];
      if (s !== undefined) {
        discount = s;
      }
      s = parms[i].split('validity=')[1];
      if (s !== undefined) {
        validity = s;
      }
      s = parms[i].split('quota=')[1];
      if (s !== undefined) {
        quota = s;
      }
      s = parms[i].split('start_date=')[1];
      if (s !== undefined) {
        start_date = s;
      }
      s = parms[i].split('end_date=')[1];
      if (s !== undefined) {
        end_date = s;
      }
    }

    function save_new() {
      let query =
        'update [Voucher] set [VoucherName]=?,[VoucherType]=?,[Qty]=?,' +
        '[Amount]=?,[Discount]=?,[Validity]=?,[VoucherStart]=?,[VoucherEnd]=?,[Quota]=? where [VoucherCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [voucher_name, voucher_type, qty, amount, discount, validity, start_date, end_date, quota, req.body.vcode],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await save_new();
  }

  if (action === 'delete_voucher') {
    function delete_voucher() {
      let query = 'delete from [Voucher] where [VoucherCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.vcode], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    function delete_voucher_rules() {
      let query = 'delete from [VoucherCondition] where [VoucherCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.vcode], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await delete_voucher();
    await delete_voucher_rules();
  }

  if (action === 'get_rule') {
    function get_rule() {
      let query = 'select * from [VoucherCondition] where [idx]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.idx], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_rule();
  }

  if (action === 'update_rule') {
    function update_rule() {
      let query =
        'update [VoucherCondition] set [Description]=?,[isNewMember]=?,[QtyCond]=?,[CourseQtyCond]=?,[WeekQtyCond]=?,[MonthQtyCond]=?,' +
        '[CourseCode]=?,[CourseMasterCode]=?,[ProductCode]=? where idx=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.rule_description,
              req.body.rule_isnewmember,
              req.body.rule_qtycond,
              req.body.rule_qtycoursecond,
              req.body.rule_weekqtycond,
              req.body.rule_monthqtycond,
              req.body.rule_coursecode,
              req.body.rule_mastercode,
              req.body.rule_productcode,
              req.body.idx
            ],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await update_rule();
  }

  if (action === 'delete_rule') {
    function delete_rule() {
      let query = 'delete from [VoucherCondition] where [idx]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.idx], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await delete_rule();
  }
  res.send(return_data);
});

router.get('/users', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  let return_data;
  const userBranchCodes = req.session.branchcode.split(',');
  //if (req.session.userrole==="Admin") {
  function get_allusers() {
    let query = 'select * from [User] where [Active]=?';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, [1], (error, results) => {
          if (!error) {
            return_data = results.filter((item) => {
              // if (item.BranchCode !== null) {
              //   const userBranch = item.BranchCode.split(",");
              //   if (
              //     userBranchCodes.includes(...userBranch) ||
              //     userBranch.includes(...userBranchCodes)
              //   ) {
              //     return item;
              //   }
              // }
              if (item.BranchCode !== null) {
                const userBranch = item.BranchCode.split(',');
                if (userBranch.some((branch) => userBranchCodes.includes(branch))) return item;
              }
            });
            if (config.debug) {
              console.log('data return : ' + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }

  await get_allusers();
  res.render('user_main', {
    config: config,
    req: req,
    return_data: return_data
  });
  //}
});

router.post('/users', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  let s;
  let return_data;
  let action = req.body.action;

  if (action === 'get_branchcode') {
    function get_branchcode() {
      let query = 'Select BranchCode from [SysCompany]';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_branchcode();
  }

  if (action === 'get_approver_list_claim') {
    function get_approver_list_claim() {
      let query = "select * from [User] where [Features] like '%ClaimApprover=1%' or [Role]='Admin'";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_approver_list_claim();
  }

  if (action === 'get_approver_list_leave') {
    function get_approver_list_leave() {
      let query = "select * from [User] where [Features] like '%LeaveApprover=1%' or [Role]='Admin'";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_approver_list_leave();
  }

  if (action === 'get_user_info') {
    function get_user_info() {
      let query = 'select * from [User] where [UserCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.code], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_user_info();
  }

  if (action === 'checkdup') {
    function checkdup() {
      let query = 'Select UserCode from [User] where [Login]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.login], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await checkdup();
  }

  if (action === 'delete_user') {
    function delete_user() {
      let query = 'update [User] set [Active]=0  where [UserCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.ucode], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await delete_user();
  }

  if (action === 'add_new') {
    let login;
    let password;
    let email;
    let mobile;
    let name;
    let user_role;
    let branchcode;
    let employed_date;
    let employed_type;
    let m_salary;
    let com_min1;
    let com_max1;
    let com_base1;
    let com_rate1;
    let com_bonus1;
    let com_min2;
    let com_max2;
    let com_base2;
    let com_rate2;
    let com_bonus2;
    let com_min3;
    let com_max3;
    let com_base3;
    let com_rate3;
    let com_bonus3;
    let com_min4;
    let com_max4;
    let com_base4;
    let com_rate4;
    let com_bonus4;
    let com_min5;
    let com_max5;
    let com_base5;
    let com_rate5;
    let com_bonus5;
    let mpf_employee;
    let mpf_employer;
    let approver_code_claim;
    let approver_name_claim;
    let approver_code_leave;
    let approver_name_leave;

    let parms = req.body.form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('login=')[1];
      if (s !== undefined) {
        login = decodeURIComponent(s);
      }
      s = parms[i].split('password=')[1];
      if (s !== undefined) {
        password = decodeURIComponent(s);
      }
      // s = parms[i].split("email=")[1];
      // if (s !== undefined) {
      //   email = decodeURIComponent(s);
      // }
      email = 'default@gmail.com';
      s = parms[i].split('mobile=')[1];
      if (s !== undefined) {
        mobile = s;
      }
      s = parms[i].split('name=')[1];
      if (s !== undefined) {
        name = decodeURIComponent(s);
      }
      s = parms[i].split('user_role=')[1];
      if (s !== undefined) {
        user_role = decodeURIComponent(s);
      }
      s = parms[i].split('branchcode=')[1];
      if (s !== undefined) {
        branchcode = decodeURIComponent(s);
      }
      s = parms[i].split('employed_date=')[1];
      if (s !== undefined) {
        employed_date = s;
      }
      s = parms[i].split('employed_type=')[1];
      if (s !== undefined) {
        employed_type = decodeURIComponent(s);
      }
      s = parms[i].split('m_salary=')[1];
      if (s !== undefined) {
        m_salary = s;
      }
      s = parms[i].split('com_min1=')[1];
      if (s !== undefined) {
        com_min1 = s;
      }
      s = parms[i].split('com_max1=')[1];
      if (s !== undefined) {
        com_max1 = s;
      }
      s = parms[i].split('com_base1=')[1];
      if (s !== undefined) {
        com_base1 = s;
      }
      s = parms[i].split('com_rate1=')[1];
      if (s !== undefined) {
        com_rate1 = s;
      }
      s = parms[i].split('com_bonus1=')[1];
      if (s !== undefined) {
        com_bonus1 = s;
      }
      s = parms[i].split('com_min2=')[1];
      if (s !== undefined) {
        com_min2 = s;
      }
      s = parms[i].split('com_max2=')[1];
      if (s !== undefined) {
        com_max2 = s;
      }
      s = parms[i].split('com_base2=')[1];
      if (s !== undefined) {
        com_base2 = s;
      }
      s = parms[i].split('com_rate2=')[1];
      if (s !== undefined) {
        com_rate2 = s;
      }
      s = parms[i].split('com_bonus2=')[1];
      if (s !== undefined) {
        com_bonus2 = s;
      }
      s = parms[i].split('com_min3=')[1];
      if (s !== undefined) {
        com_min3 = s;
      }
      s = parms[i].split('com_max3=')[1];
      if (s !== undefined) {
        com_max3 = s;
      }
      s = parms[i].split('com_base3=')[1];
      if (s !== undefined) {
        com_base3 = s;
      }
      s = parms[i].split('com_rate3=')[1];
      if (s !== undefined) {
        com_rate3 = s;
      }
      s = parms[i].split('com_bonus3=')[1];
      if (s !== undefined) {
        com_bonus3 = s;
      }
      s = parms[i].split('com_min4=')[1];
      if (s !== undefined) {
        com_min4 = s;
      }
      s = parms[i].split('com_max4=')[1];
      if (s !== undefined) {
        com_max4 = s;
      }
      s = parms[i].split('com_base4=')[1];
      if (s !== undefined) {
        com_base4 = s;
      }
      s = parms[i].split('com_rate4=')[1];
      if (s !== undefined) {
        com_rate4 = s;
      }
      s = parms[i].split('com_bonus4=')[1];
      if (s !== undefined) {
        com_bonus4 = s;
      }
      s = parms[i].split('com_min5=')[1];
      if (s !== undefined) {
        com_min5 = s;
      }
      s = parms[i].split('com_max5=')[1];
      if (s !== undefined) {
        com_max5 = s;
      }
      s = parms[i].split('com_base5=')[1];
      if (s !== undefined) {
        com_base5 = s;
      }
      s = parms[i].split('com_rate5=')[1];
      if (s !== undefined) {
        com_rate5 = s;
      }
      s = parms[i].split('com_bonus5=')[1];
      if (s !== undefined) {
        com_bonus5 = s;
      }
      s = parms[i].split('mpf_employee=')[1];
      if (s !== undefined) {
        mpf_employee = s;
      }
      s = parms[i].split('mpf_employer=')[1];
      if (s !== undefined) {
        mpf_employer = s;
      }
      s = parms[i].split('approver_code_claim=')[1];
      if (s !== undefined) {
        approver_code_claim = s;
      }
      s = parms[i].split('approver_name_claim=')[1];
      if (s !== undefined) {
        approver_name_claim = decodeURIComponent(s);
      }
      s = parms[i].split('approver_code_leave=')[1];
      if (s !== undefined) {
        approver_code_leave = s;
      }
      s = parms[i].split('approver_name_leave=')[1];
      if (s !== undefined) {
        approver_name_leave = decodeURIComponent(s);
      }
    }

    function add_new_user() {
      let query =
        '[sp_User_Create] @Login=?,@Password=?,@Email=?,@Phone=?,@Name=?,@Role=?,@BranchCode=?,@MainBranch=?,@Employed_Date=?,@EmploymentType=?,@Monthly=?,' +
        '@com_min1=?,@com_max1=?,@com_base1=?,@com_rate1=?,@com_bonus1=?,@com_min2=?,@com_max2=?,' +
        '@com_base2=?,@com_rate2=?,@com_bonus2=?,@com_min3=?,@com_max3=?,@com_base3=?,@com_rate3=?,' +
        '@com_bonus3=?,@com_min4=?,@com_max4=?,@com_base4=?,@com_rate4=?,@com_bonus4=?,@com_min5=?,' +
        '@com_max5=?,@com_base5=?,@com_rate5=?,@com_bonus5=?,@MPF_Employee=?,@MPF_Employer=?,@Features=?,' +
        '@Active=?,@CreateDate=?,@Createby=?,@Approver_id_leave=?,@Approver_name_leave=?,@Approver_id_claim=?,@Approver_name_claim=?';
      if (config.debug) {
        console.log(query);
        console.log(
          '[ ' +
            login +
            ' , ' +
            password +
            ' , ' +
            email +
            ' , ' +
            mobile +
            ' , ' +
            name +
            ' , ' +
            user_role +
            ' , ' +
            branchcode +
            ' , ' +
            employed_date +
            ' , ' +
            employed_type +
            ' , ' +
            m_salary +
            ' , ' +
            com_min1 +
            ' , ' +
            com_max1 +
            ' , ' +
            com_base1 +
            ' , ' +
            com_rate1 +
            ' , ' +
            com_bonus1 +
            ' , ' +
            com_min2 +
            ' , ' +
            com_max2 +
            ' , ' +
            com_base2 +
            ' , ' +
            com_rate2 +
            ' , ' +
            com_bonus2 +
            ' , ' +
            com_min3 +
            ' , ' +
            com_max3 +
            ' , ' +
            com_base3 +
            ' , ' +
            com_rate3 +
            ' , ' +
            com_bonus3 +
            ' , ' +
            com_min4 +
            ' , ' +
            com_max4 +
            ' , ' +
            com_base4 +
            ' , ' +
            com_rate4 +
            ' , ' +
            com_bonus4 +
            ' , ' +
            com_min5 +
            ' , ' +
            com_max5 +
            ' , ' +
            com_base5 +
            ' , ' +
            com_rate5 +
            ' , ' +
            com_bonus5 +
            ' , ' +
            mpf_employee +
            ' , ' +
            mpf_employer +
            ' , ' +
            req.body.additional_features +
            ' , ' +
            1 +
            ' , ' +
            new Date() +
            ' , ' +
            req.session.usercode +
            ' ]'
        );
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              login,
              password,
              email,
              mobile,
              name,
              user_role,
              branchcode,
              branchcode,
              employed_date,
              employed_type,
              m_salary,
              com_min1,
              com_max1,
              com_base1,
              com_rate1,
              com_bonus1,
              com_min2,
              com_max2,
              com_base2,
              com_rate2,
              com_bonus2,
              com_min3,
              com_max3,
              com_base3,
              com_rate3,
              com_bonus3,
              com_min4,
              com_max4,
              com_base4,
              com_rate4,
              com_bonus4,
              com_min5,
              com_max5,
              com_base5,
              com_rate5,
              com_bonus5,
              mpf_employee,
              mpf_employer,
              req.body.additional_features,
              1,
              new Date(),
              req.session.usercode,
              approver_code_leave,
              approver_name_leave,
              approver_code_claim,
              approver_name_claim
            ],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await add_new_user();
  }

  if (action === 'update') {
    let login;
    let user_code;
    let password;
    let email;
    let mobile;
    let name;
    let user_role;
    let branchcode;
    let employed_date;
    let employed_type;
    let m_salary;
    let com_min1;
    let com_max1;
    let com_base1;
    let com_rate1;
    let com_bonus1;
    let com_min2;
    let com_max2;
    let com_base2;
    let com_rate2;
    let com_bonus2;
    let com_min3;
    let com_max3;
    let com_base3;
    let com_rate3;
    let com_bonus3;
    let com_min4;
    let com_max4;
    let com_base4;
    let com_rate4;
    let com_bonus4;
    let com_min5;
    let com_max5;
    let com_base5;
    let com_rate5;
    let com_bonus5;
    let mpf_employee;
    let mpf_employer;
    let approver_code_claim;
    let approver_name_claim;
    let approver_code_leave;
    let approver_name_leave;

    let parms = req.body.form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('user_code=')[1];
      if (s !== undefined) {
        user_code = s;
      }
      s = parms[i].split('login=')[1];
      if (s !== undefined) {
        login = decodeURIComponent(s);
      }
      s = parms[i].split('password=')[1];
      if (s !== undefined) {
        //if null then password will not change
        password = decodeURIComponent(s) === 'null' ? null : decodeURIComponent(s);
      }
      // s = parms[i].split("email=")[1];
      // if (s !== undefined) {
      //   email = decodeURIComponent(s);
      // }
      email = 'default@gmail.com';
      s = parms[i].split('mobile=')[1];
      if (s !== undefined) {
        mobile = s;
      }
      s = parms[i].split('name=')[1];
      if (s !== undefined) {
        name = decodeURIComponent(s);
      }
      s = parms[i].split('user_role=')[1];
      if (s !== undefined) {
        user_role = decodeURIComponent(s);
      }
      s = parms[i].split('branchcode=')[1];
      if (s !== undefined) {
        branchcode = decodeURIComponent(s);
      }
      s = parms[i].split('employed_date=')[1];
      if (s !== undefined) {
        employed_date = s;
      }
      s = parms[i].split('employed_type=')[1];
      if (s !== undefined) {
        employed_type = decodeURIComponent(s);
      }
      s = parms[i].split('m_salary=')[1];
      if (s !== undefined) {
        m_salary = s;
      }
      s = parms[i].split('com_min1=')[1];
      if (s !== undefined) {
        com_min1 = s;
      }
      s = parms[i].split('com_max1=')[1];
      if (s !== undefined) {
        com_max1 = s;
      }
      s = parms[i].split('com_base1=')[1];
      if (s !== undefined) {
        com_base1 = s;
      }
      s = parms[i].split('com_rate1=')[1];
      if (s !== undefined) {
        com_rate1 = s;
      }
      s = parms[i].split('com_bonus1=')[1];
      if (s !== undefined) {
        com_bonus1 = s;
      }
      s = parms[i].split('com_min2=')[1];
      if (s !== undefined) {
        com_min2 = s;
      }
      s = parms[i].split('com_max2=')[1];
      if (s !== undefined) {
        com_max2 = s;
      }
      s = parms[i].split('com_base2=')[1];
      if (s !== undefined) {
        com_base2 = s;
      }
      s = parms[i].split('com_rate2=')[1];
      if (s !== undefined) {
        com_rate2 = s;
      }
      s = parms[i].split('com_bonus2=')[1];
      if (s !== undefined) {
        com_bonus2 = s;
      }
      s = parms[i].split('com_min3=')[1];
      if (s !== undefined) {
        com_min3 = s;
      }
      s = parms[i].split('com_max3=')[1];
      if (s !== undefined) {
        com_max3 = s;
      }
      s = parms[i].split('com_base3=')[1];
      if (s !== undefined) {
        com_base3 = s;
      }
      s = parms[i].split('com_rate3=')[1];
      if (s !== undefined) {
        com_rate3 = s;
      }
      s = parms[i].split('com_bonus3=')[1];
      if (s !== undefined) {
        com_bonus3 = s;
      }
      s = parms[i].split('com_min4=')[1];
      if (s !== undefined) {
        com_min4 = s;
      }
      s = parms[i].split('com_max4=')[1];
      if (s !== undefined) {
        com_max4 = s;
      }
      s = parms[i].split('com_base4=')[1];
      if (s !== undefined) {
        com_base4 = s;
      }
      s = parms[i].split('com_rate4=')[1];
      if (s !== undefined) {
        com_rate4 = s;
      }
      s = parms[i].split('com_bonus4=')[1];
      if (s !== undefined) {
        com_bonus4 = s;
      }
      s = parms[i].split('com_min5=')[1];
      if (s !== undefined) {
        com_min5 = s;
      }
      s = parms[i].split('com_max5=')[1];
      if (s !== undefined) {
        com_max5 = s;
      }
      s = parms[i].split('com_base5=')[1];
      if (s !== undefined) {
        com_base5 = s;
      }
      s = parms[i].split('com_rate5=')[1];
      if (s !== undefined) {
        com_rate5 = s;
      }
      s = parms[i].split('com_bonus5=')[1];
      if (s !== undefined) {
        com_bonus5 = s;
      }
      s = parms[i].split('mpf_employee=')[1];
      if (s !== undefined) {
        mpf_employee = s;
      }
      s = parms[i].split('mpf_employer=')[1];
      if (s !== undefined) {
        mpf_employer = s;
      }
      s = parms[i].split('approver_code_claim=')[1];
      if (s !== undefined) {
        approver_code_claim = s;
      }
      s = parms[i].split('approver_name_claim=')[1];
      if (s !== undefined) {
        approver_name_claim = decodeURIComponent(s);
      }
      s = parms[i].split('approver_code_leave=')[1];
      if (s !== undefined) {
        approver_code_leave = s;
      }
      s = parms[i].split('approver_name_leave=')[1];
      if (s !== undefined) {
        approver_name_leave = decodeURIComponent(s);
      }
    }

    if (employed_date.includes('%2F')) {
      let hold;
      employed_date = employed_date.replaceAll('%2F', '-');
      employed_date = employed_date.split('-');
      hold = employed_date[0];
      employed_date[0] = employed_date[2];
      employed_date[2] = hold;
      hold = employed_date[2];
      employed_date[2] = employed_date[1];
      employed_date[1] = hold;
      employed_date = employed_date.join('-');
    }

    function add_new_user() {
      let query =
        '[sp_User_Edit] @UserCode=?,@Password=?,@Email=?,@Phone=?,@Name=?,@Role=?,@BranchCode=?,@MainBranch=?,@Employed_Date=?,@EmploymentType=?,@Monthly=?,' +
        '@com_min1=?,@com_max1=?,@com_base1=?,@com_rate1=?,@com_bonus1=?,@com_min2=?,@com_max2=?,' +
        '@com_base2=?,@com_rate2=?,@com_bonus2=?,@com_min3=?,@com_max3=?,@com_base3=?,@com_rate3=?,' +
        '@com_bonus3=?,@com_min4=?,@com_max4=?,@com_base4=?,@com_rate4=?,@com_bonus4=?,@com_min5=?,' +
        '@com_max5=?,@com_base5=?,@com_rate5=?,@com_bonus5=?,@MPF_Employee=?,@MPF_Employer=?,@Features=?,' +
        '@Active=?,@ModifyDate=?,@Modifyby=?,@Approver_id_leave=?,@Approver_name_leave=?,@Approver_id_claim=?,@Approver_name_claim=?';
      if (config.debug) {
        console.log(query);
        console.log(
          '[ ' +
            user_code +
            ' , ' +
            password +
            ' , ' +
            email +
            ' , ' +
            mobile +
            ' , ' +
            name +
            ' , ' +
            user_role +
            ' , ' +
            branchcode +
            ' , ' +
            employed_date +
            ' , ' +
            employed_type +
            ' , ' +
            m_salary +
            ' , ' +
            com_min1 +
            ' , ' +
            com_max1 +
            ' , ' +
            com_base1 +
            ' , ' +
            com_rate1 +
            ' , ' +
            com_bonus1 +
            ' , ' +
            com_min2 +
            ' , ' +
            com_max2 +
            ' , ' +
            com_base2 +
            ' , ' +
            com_rate2 +
            ' , ' +
            com_bonus2 +
            ' , ' +
            com_min3 +
            ' , ' +
            com_max3 +
            ' , ' +
            com_base3 +
            ' , ' +
            com_rate3 +
            ' , ' +
            com_bonus3 +
            ' , ' +
            com_min4 +
            ' , ' +
            com_max4 +
            ' , ' +
            com_base4 +
            ' , ' +
            com_rate4 +
            ' , ' +
            com_bonus4 +
            ' , ' +
            com_min5 +
            ' , ' +
            com_max5 +
            ' , ' +
            com_base5 +
            ' , ' +
            com_rate5 +
            ' , ' +
            com_bonus5 +
            ' , ' +
            mpf_employee +
            ' , ' +
            mpf_employer +
            ' , ' +
            req.body.additional_features +
            ' , ' +
            1 +
            ' , ' +
            new Date() +
            ' , ' +
            req.session.usercode +
            ' ]'
        );
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              user_code,
              password,
              email,
              mobile,
              name,
              user_role,
              branchcode,
              branchcode,
              employed_date,
              employed_type,
              m_salary,
              com_min1,
              com_max1,
              com_base1,
              com_rate1,
              com_bonus1,
              com_min2,
              com_max2,
              com_base2,
              com_rate2,
              com_bonus2,
              com_min3,
              com_max3,
              com_base3,
              com_rate3,
              com_bonus3,
              com_min4,
              com_max4,
              com_base4,
              com_rate4,
              com_bonus4,
              com_min5,
              com_max5,
              com_base5,
              com_rate5,
              com_bonus5,
              mpf_employee,
              mpf_employer,
              req.body.additional_features,
              1,
              new Date(),
              req.session.usercode,
              approver_code_leave,
              approver_name_leave,
              approver_code_claim,
              approver_name_claim
            ],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await add_new_user();
  }

  if (action === 'refresh_users') {
    function get_allusers() {
      let query = 'select * from [User] where [Active]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [1], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await get_allusers();
  }
  res.send(return_data);
});

router.post('/mastertb', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;

  if (action === 'add_leave_type') {
    function add_leave_type() {
      let query = 'insert into [Lookup_EForm_LeaveType] (Type,HK,CN) values(?,?,?)';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.en_name, req.body.hk_name, req.body.cn_name], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await add_leave_type();
  }

  if (action === 'add_claim_type') {
    function add_claim_type() {
      let query = 'insert into [Lookup_EForm_ExpensesType] (Type,HK,CN) values(?,?,?)';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.en_name, req.body.hk_name, req.body.cn_name], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await add_claim_type();
  }

  if (action === 'add_venue') {
    function add_venue() {
      let query = 'insert into [Venue] (VenueCode,VenueName,BranchCode,CreateDate,CreateBy,Active) values(?,?,?,?,?,?)';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.vcode, req.body.vname, req.body.bcode, new Date(), req.session.usercode, 1],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await add_venue();
  }

  if (action === 'del_leave_type') {
    function del_leave_type() {
      let query = 'delete from [Lookup_EForm_LeaveType] where [Id] = ?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.Id], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await del_leave_type();
  }

  if (action === 'del_claim_type') {
    function del_claim_type() {
      let query = 'delete from [Lookup_EForm_ExpensesType] where [Id] = ?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.Id], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await del_claim_type();
  }

  if (action === 'del_venue') {
    function del_venue() {
      let query = 'update [Venue] Set Active = 0 where Idx =?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.Id], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await del_venue();
  }

  if (action === 'update_claim_type') {
    function update_claim_type() {
      let query = 'update [Lookup_EForm_ExpensesType] Set Type=?,HK=?,CN=? where [Id] = ?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.en_name, req.body.hk_name, req.body.cn_name, req.body.Id], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await update_claim_type();
  }

  if (action === 'update_leave_type') {
    function update_leave_type() {
      let query = 'update [Lookup_EForm_LeaveType] Set Type=?,HK=?,CN=? where [Id] = ?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.en_name, req.body.hk_name, req.body.cn_name, req.body.Id], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await update_leave_type();
  }

  if (action === 'update_venue') {
    function update_venue() {
      let query = 'update [Venue] Set VenueCode=?,VenueName=?,BranchCode=?,ModifyDate=?,ModifyBy=? where Idx=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.vcode, req.body.vname, req.body.bcode, new Date(), req.session.usercode, req.body.Id],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await update_venue();
  }

  res.send(return_data);
});

router.get('/mastertb', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let leavetb;
  let claimtb;
  let venues;

  function get_leave_type() {
    let query = 'Select * FROM [Lookup_EForm_LeaveType]';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            leavetb = results;
            if (config.debug) {
              console.log('data return : ' + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }
  await get_leave_type();

  function get_claim_type() {
    let query = 'Select * FROM [Lookup_EForm_ExpensesType]';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            claimtb = results;
            if (config.debug) {
              console.log('data return : ' + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }
  await get_claim_type();

  function get_venue() {
    let query = 'Select * FROM [Venue] where Active=1 order by Idx';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            venues = results;
            if (config.debug) {
              console.log('data return : ' + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }
  await get_venue();

  res.render('mastertb', {
    config: config,
    req: req,
    leavetb: leavetb,
    claimtb: claimtb,
    venue: venues
  });
});

router.get('/holidays', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;

  function get_holidays() {
    let query;
    if (req.query.date) {
      query = "SELECT * FROM [SysHoliday] where YEAR(HolidayDate) = YEAR('" + req.query.date + "')";
      ddd = req.query.date;
    } else {
      query = 'SELECT * FROM [SysHoliday] where YEAR(HolidayDate) >= YEAR(GETDATE())';
      ddd = new Date().getFullYear();
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
              console.log('data return : ' + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }
  await get_holidays();

  res.render('holidays', {
    config: config,
    req: req,
    return_data,
    date: ddd
  });
});

router.post('/holidays', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;

  if (action === 'add_hol') {
    function add_hol() {
      let query = 'insert into [SysHoliday] (HolidayDate,HolidayEng,HolidayChi) values(?,?,?)';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.hol, req.body.en_name, req.body.hk_name], (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                console.log('data return : ' + JSON.stringify(results));
              }
              resolve();
            } else {
              console.log(error);
            }
          });
        }, 10); //1/10 sec
      });
    }
    await add_hol();
  }

  if (action === 'del_hol') {
    function del_hol() {
      let query = 'delete from [SysHoliday] where [HolidayDate] = ?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              new Date(req.body.hol).toLocaleDateString('en-CA', {
                timeZone: 'GMT'
              })
            ],
            (error, results) => {
              if (!error) {
                return_data = results;
                if (config.debug) {
                  console.log('data return : ' + JSON.stringify(results));
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
    await del_hol();
  }

  res.send(return_data);
});

router.post('/system', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;

  res.send(return_data);
});

module.exports = router;
