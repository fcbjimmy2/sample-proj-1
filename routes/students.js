const config = require('../config');
const express = require('express');
const router = express.Router();
const sql = require('msnodesqlv8');

router.get('/contacts', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  if (req.session.userrole === 'Teacher') {
    return res.redirect('/home');
  }

  let teacher_pf;
  const userBranchCodes = req.session.branchcode.split(',');
  function get_student_list() {
    // let's show me everything
    //        let query = "select * from [Student] where [Active]=?";
    let query = 'select StudentCode, FirstName, LastName, Mobile, Email, Form, CreateDate, BranchCode from [Student] where [Active]=?';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, [1], (error, results) => {
          if (!error) {
            student_list = results.filter((item) => {
              const userBranch = item.BranchCode.split(',');
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

  await get_student_list();

  res.render('students', {
    config: config,
    req: req,
    student_list: student_list
  });
});

router.post('/info', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_date;
  let action = req.body.action;
  let form = req.body.form;
  const userBranchCodes = req.session.branchcode.split(',');

  if (action === 'get_student_info') {
    function get_student_info() {
      // let's show me everything
      let query = 'select * from [Student] where [StudentCode]=?';
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
    await get_student_info();
  }

  if (action === 'get_class_info') {
    function get_class_info() {
      // let's show me everything
      let query = 'EXEC [sp_Student_CourseClassSummary] @StudentCode=?';
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
    await get_class_info();
  }

  if (action === 'get_invoice_info') {
    function get_invoice_info() {
      // let's show me everything
      let query = 'EXEC [sp_Student_Payment] @StudentCode=?';
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
    await get_invoice_info();
  }

  if (action === 'update_student') {
    let s;
    let parms = form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('student_code=')[1];
      if (s !== undefined) {
        student_code = s;
      }
      s = parms[i].split('gender=')[1];
      if (s !== undefined) {
        gender = s;
      }
      s = parms[i].split('name_eng=')[1];
      if (s !== undefined) {
        name_eng = decodeURIComponent(s);
      }
      s = parms[i].split('name_chi=')[1];
      if (s !== undefined) {
        name_chi = decodeURIComponent(s);
      }
      s = parms[i].split('dob=')[1];
      if (s !== undefined) {
        dob = decodeURIComponent(s);
      }
      s = parms[i].split('email=')[1];
      if (s !== undefined) {
        email = decodeURIComponent(s);
      }
      s = parms[i].split('stu_mobile=')[1];
      if (s !== undefined) {
        mobile = s;
      }
      s = parms[i].split('branchcode=')[1];
      if (s !== undefined) {
        branchcode = decodeURIComponent(s);
      }
      s = parms[i].split('address=')[1];
      if (s !== undefined) {
        address = decodeURIComponent(s);
      }
      s = parms[i].split('em_contact=')[1];
      if (s !== undefined) {
        em_contact = decodeURIComponent(s);
      }
      s = parms[i].split('em_mobile=')[1];
      if (s !== undefined) {
        em_mobile = decodeURIComponent(s);
      }
      s = parms[i].split('school=')[1];
      if (s !== undefined) {
        school = decodeURIComponent(s);
      }
      s = parms[i].split('level=')[1];
      if (s !== undefined) {
        level = decodeURIComponent(s);
      }
      s = parms[i].split('remarks=')[1];
      if (s !== undefined) {
        remarks = decodeURIComponent(s);
      }
    }
    console.log(
      '[ ' +
        student_code +
        ' ' +
        email +
        ' ' +
        mobile +
        ' ' +
        branchcode +
        ' ' +
        name_eng +
        ' ' +
        name_chi +
        ' ' +
        gender +
        ' ' +
        dob +
        ' ' +
        address +
        ' ' +
        school +
        ' ' +
        level +
        ' ' +
        em_contact +
        ' ' +
        em_mobile +
        ' ' +
        school +
        ' ]'
    );

    function update_Profile() {
      let query =
        '[sp_Student_Edit] @StudentCode=?,@Email=?,@Mobile=?,@BranchCode=? ,@FirstName=?,@LastName=?,@Gender=?,@DOB=?,@Address=?,@SchoolName=?,@Form=?,@EmergencyContactNo1=?,' +
        '@EmergencyContactPerson1=?,@ModifyDate=?,@Modifyby=?,@Remarks=?, @Active=?';
      if (config.debug) {
        console.log(query);
      }
      // make sure don't missed anything
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              student_code,
              email,
              mobile,
              branchcode,
              name_eng,
              name_chi,
              gender,
              dob,
              address,
              school,
              level,
              em_contact,
              em_mobile,
              new Date(),
              req.session.usercode,
              remarks,
              1
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
    // function get_student_list() {
    //   // let's show me everything
    //   let query = "select * from [Student] where [Active]=?";
    //   if (config.debug) {
    //     console.log(query);
    //   }
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       sql.query(config.db, query, [1], (error, results) => {
    //         if (!error) {
    //           return_data = results;
    //           if (config.debug) {
    //             console.log("data return : " + JSON.stringify(results));
    //           }
    //           resolve();
    //         } else {
    //           console.log(error);
    //         }
    //       });
    //     }, 10); //1/10 sec
    //   });
    // }
    function get_student_list() {
      // let's show me everything
      let query = 'select StudentCode, FirstName, LastName, Mobile, Email, Form, CreateDate, BranchCode from [Student] where [Active]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [1], (error, results) => {
            if (!error) {
              return_data = results.filter((item) => {
                const userBranch = item.BranchCode.split(',');
                // if (
                //   userBranchCodes.includes(...userBranch) ||
                //   userBranch.includes(...userBranchCodes)
                // ) {
                //   return item;
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
    await update_Profile();
    await get_student_list();
  }

  if (action === 'add_rating') {
    function add_rating() {
      let query = 'UPDATE [StudentClass] set [Points]=?,[PointsGivenBy]=? where [ClassCode]=? and [StudentCode]=?';
      if (config.debug) {
        console.log(query);
      }
      // make sure don't missed anything
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.points, req.session.usercode, req.body.ccode, req.body.student_code], (error, results) => {
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
    await add_rating();
  }
  res.send(return_data);
});

router.get('/registration', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  if (req.session.userrole === 'Teacher') {
    return res.redirect('/home');
  }
  res.render('students_reg', {
    config: config,
    req: req
  });
});

router.post('/registration', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;
  let form = req.body.form;

  if (action === 'save_student') {
    let s;
    let parms = form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('gender=')[1];
      if (s !== undefined) {
        gender = s;
      }
      s = parms[i].split('name_eng=')[1];
      if (s !== undefined) {
        name_eng = decodeURIComponent(s);
      }
      s = parms[i].split('name_chi=')[1];
      if (s !== undefined) {
        name_chi = decodeURIComponent(s);
      }
      s = parms[i].split('dob=')[1];
      if (s !== undefined) {
        dob = decodeURIComponent(s);
      }
      s = parms[i].split('email=')[1];
      if (s !== undefined) {
        email = decodeURIComponent(s);
      }
      s = parms[i].split('stu_mobile=')[1];
      if (s !== undefined) {
        mobile = s;
      }
      s = parms[i].split('branchcode=')[1];
      if (s !== undefined) {
        branchcode = decodeURIComponent(s);
      }
      s = parms[i].split('address=')[1];
      if (s !== undefined) {
        address = decodeURIComponent(s);
      }
      s = parms[i].split('em_contact=')[1];
      if (s !== undefined) {
        em_contact = decodeURIComponent(s);
      }
      s = parms[i].split('em_mobile=')[1];
      if (s !== undefined) {
        em_mobile = decodeURIComponent(s);
      }
      s = parms[i].split('school=')[1];
      if (s !== undefined) {
        school = decodeURIComponent(s);
      }
      s = parms[i].split('level=')[1];
      if (s !== undefined) {
        level = decodeURIComponent(s);
      }
      s = parms[i].split('remarks=')[1];
      if (s !== undefined) {
        remarks = decodeURIComponent(s);
      }
    }

    console.log(
      '[ ' +
        email +
        ' ' +
        mobile +
        ' ' +
        branchcode +
        ' ' +
        name_eng +
        ' ' +
        name_chi +
        ' ' +
        gender +
        ' ' +
        dob +
        ' ' +
        address +
        ' ' +
        school +
        ' ' +
        level +
        ' ' +
        em_contact +
        ' ' +
        em_mobile +
        ' ' +
        school +
        ' ]'
    );

    function update_Profile() {
      let query =
        '[sp_Student_Create] @Email=?,@Mobile=?,@EnglishName=?,@ChineseName=?,@Gender=?,@DOB=?,@Address=?,@SchoolName=?,@Form=?,@EmergencyContactNo1=?,' +
        '@EmergencyContactPerson1=?,@Remarks=?,@CreateDate=?,@Createby=?,@BranchCode=?';
      if (config.debug) {
        console.log(query);
      }
      // make sure don't missed anything
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              email,
              mobile,
              name_eng,
              name_chi,
              gender,
              dob,
              address,
              school,
              level,
              em_contact,
              em_mobile,
              remarks,
              new Date(),
              req.session.usercode,
              branchcode
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

    await update_Profile();
  }
  res.send(return_data);
});

router.post('/uservouchers', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }

  let { code: studentc } = req.body;
  let return_data;
  let action = req.body.action;
  let voucherIdx = req.body?.idx;

  if (action === 'get_vouchers') {
    function get_uservouchers() {
      let query = 'select * from [VoucherUser] where [StudentCode]=? and [Active]=?';
      // let query = 'select * from [VoucherUser]';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [studentc, 1], (error, results) => {
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
    await get_uservouchers();
  }

  if (action === 'delete_voucher') {
    let active = false;
    function delete_voucher() {
      let query = 'Update [VoucherUser] set [Active]=? where [Idx]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [active, voucherIdx], (error, results) => {
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
  }

  res.send(return_data);
});

router.post('/adduservouchers', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  //Generate SN
  function generateSerial() {
    let chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let serialLength = 10;
    let randomSerial = '';
    let randomNumber;

    for (let i = 0; i < serialLength; i = i + 1) {
      randomNumber = Math.floor(Math.random() * chars.length);
      randomSerial += chars.substring(randomNumber, randomNumber + 1);
    }

    return randomSerial;
  }

  let form = req.body.form;
  let student_code = req.body.code;
  let return_data;

  //form data
  let voucher_name;
  let voucher_code;
  let voucher_type;
  let qty;
  let s;
  let amount = 0;
  let discount = 0;
  let validity;
  let quota;
  let start_date;
  let end_date;
  let parms = form.split('&');
  let sn = generateSerial();

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
  console.log('-----------------------------------passed data-----------------------------------');
  console.log(
    req.body.code +
      ' ' +
      voucher_name +
      ' ' +
      voucher_code +
      ' ' +
      voucher_type +
      ' ' +
      qty +
      ' ' +
      validity +
      ' ' +
      validity +
      ' ' +
      amount +
      ' ' +
      discount +
      ' ' +
      quota +
      ' ' +
      start_date +
      ' ' +
      end_date
  );

  function update_uservoucher() {
    let query =
      'insert into [VoucherUser] ([StudentCode],[VoucherCode],[VoucherName],[VoucherType],[SN],[Qty],[Used],[UsedDate],[Active],[ExpDate],[CourseCode],[CourseMasterCode],[ProductCode],[Price],[InvoiceNo],[CartID])' +
      ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(
          config.db,
          query,
          [req.body.code, voucher_code, voucher_name, '*Coupon', sn, 1, 0, null, 1, end_date, '*', '*', '*', amount, '', ''],
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
  await update_uservoucher();

  res.send('ok');
});

module.exports = router;
