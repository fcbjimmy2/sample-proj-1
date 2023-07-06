const config = require('../config');
const express = require('express');
const router = express.Router();
const sql = require('msnodesqlv8');
const { getElSeg } = require('../assets/plugins/fullcalendar/js/main');

router.get('/list', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let course_info;

  function get_course_info() {
    // let's show me everything
    let query = 'EXEC sp_Course_Get';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            console.log(results);
            course_info = results;

            if (config.debug) {
              console.log('data return : ' + JSON.stringify(course_info));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }

  await get_course_info();
  res.render('course_booking', {
    config: config,
    req: req,
    course_info: course_info
  });
});

router.all('/list2', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let course_info;

  function get_course_info() {
    // let's show me everything
    let query = 'EXEC sp_Course_Get';
    console.log(req.body.ccode);
    if (req.body.ccode !== undefined) {
      // or just show this one
      console.log(req.body.ccode);
      query = "select * from [v_Course] where CourseCode='" + req.body.ccode + "'";
    }
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            course_info = results;
            if (config.debug) {
              console.log('data return : ' + JSON.stringify(course_info));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }

  await get_course_info();
  res.send(course_info);
});

router.post('/booking', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let query;
  let action = req.body.action;
  let ccode = req.body.ccode;
  let form = req.body.form;
  console.log(form);

  if (action === 'get_student') {
    function get_student() {
      let query = 'EXEC sp_Course_EnrollList_Get @CourseCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [ccode], (error, results) => {
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

    await get_student();
  }

  if (action === 'get_class') {
    let s_code;
    if (req.body.student) {
      s_code = req.body.student;
    } else {
      s_code = '*';
    }

    function get_class() {
      let query = 'EXEC sp_Course_Class_Get @CourseCode=?, @StudentCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [ccode, s_code], (error, results) => {
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

    await get_class();
  }

  if (action === 'get_voucher') {
    console.log('--------------------------------form--------------------------------');
    console.log(form);
    let student_id = form.split('&')[0];
    student_id = student_id.split('student_id=')[1];
    console.log(student_id);
    let ccode = form.split('&')[1];
    ccode = ccode.split('form_course_code=')[1];
    console.log(ccode);
    let classCode = form.split('&')[2];
    classCode = classCode.split('form_class_code=')[1];
    classCode = classCode.replace(/~/g, '|');
    console.log(classCode);

    function get_voucher() {
      let query = 'EXEC sp_Voucher_Get @StudentCode=?, @CourseCode=?, @ClassCode=? ';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [student_id, ccode, classCode], (error, results) => {
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

    await get_voucher();
  }

  if (action === 'get_product_list') {
    function get_product_list() {
      query = 'EXEC [sp_Product_Get] @BranchCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.branchcode], (error, results) => {
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

    await get_product_list();
  }

  if (action === 'pre_invoice') {
    let student_id = form.split('&')[0];
    student_id = student_id.split('inv_student_code=')[1];
    console.log('-----------------------------------------------------------------------------------');
    console.log(req.session.usercode);
    console.log(student_id);

    let ccode = form.split('&')[1];
    ccode = ccode.split('inv_course_code=')[1];
    console.log(ccode);

    let classCode = form.split('&')[2];
    classCode = classCode.split('inv_class_code=')[1];
    classCode = classCode.replace(/~/g, '|');
    console.log(classCode);

    let voucher = form.split('&')[3];
    voucher = voucher.split('inv_voucher=')[1];
    voucher = voucher.replace(/~/g, '|');
    console.log(voucher);
    console.log('-----------------------------------------------------------------------------------');

    function pre_invoice() {
      let query = 'EXEC sp100_Course_PrepareInvoice @UserCode=?, @StudentCode=?, @CourseCode=?, @ClassCode=?, @Voucher=?, @Remarks=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.session.usercode, student_id, ccode, classCode, voucher, ''], (error, results) => {
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

    await pre_invoice();
  }

  if (action === 'upd_inv_price') {
    function upd_inv_price() {
      if (config.debug) {
        console.log(req.body.cartid);
      }
      // just update price
      query = 'update [InvoiceItem] set [UnitPrice]=?,[Qty]=?,[Amount]=? where [Idx]=?';
      let amt = Number(req.body.price * req.body.qty);
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.price, req.body.qty, amt, req.body.idx], (error, results) => {
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

    await upd_inv_price();
  }

  if (action === 'upd_inv_remarks') {
    function upd_inv_remarks() {
      let s;
      let parms = form.split('&');
      for (let i = 0; i < parms.length; i++) {
        s = parms[i].split('inv_remarks=')[1];
        if (s !== undefined) {
          inv_remarks = decodeURIComponent(s);
        }
        s = parms[i].split('inv_cartid=')[1];
        if (s !== undefined) {
          inv_cartid = s;
        }
      }
      query = 'update [InvoiceHeader] set [Remarks]=? where [CartID]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [inv_remarks, inv_cartid], (error, results) => {
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

    await upd_inv_remarks();
  }

  if (action === 'upd_inv_grandtotal') {
    function upd_inv_grandtotal() {
      let s;
      let parms = form.split('&');
      for (let i = 0; i < parms.length; i++) {
        s = parms[i].split('inv_grand_total=')[1];
        if (s !== undefined) {
          inv_grand_total = s;
        }
        s = parms[i].split('inv_cartid=')[1];
        if (s !== undefined) {
          inv_cartid = s;
        }
      }
      query = 'update [InvoiceHeader] set [TotalAmount]=? where [CartID]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [inv_grand_total, inv_cartid], (error, results) => {
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

    await upd_inv_grandtotal();
  }

  if (action === 'remove_inv_item') {
    function remove_inv_item() {
      query = 'delete from [InvoiceItem] where [Idx]=?';
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

    await remove_inv_item();
  }

  if (action === 'add_inv_item') {
    function add_inv_item() {
      query = 'EXEC [sp101_AddProduct] @CartID=?, @ProductCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.cartid, req.body.pcode], (error, results) => {
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

    await add_inv_item();
  }

  if (action === 'confirm_invoice') {
    function confirm_invoice() {
      query = 'EXEC [sp101_Course_SubmitInvoice] @CartID=?';
      if (config.debug) {
        console.log(query);
      }
      console.log('confirm using ########################' + req.body.cartid);
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.cartid], (error, results) => {
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

    await confirm_invoice();
  }

  if (action === 'confirm_payment') {
    function confirm_payment() {
      query = 'EXEC [sp102_Course_Pay] @InvoiceNo=?, @PaymentMethod=?, @UserCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.invoice, req.body.p_method, req.session.usercode], (error, results) => {
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

    await confirm_payment();
  }

  res.send(return_data);
});

router.get('/query', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  res.render('query', {
    config: config,
    req: req
  });
});

router.post('/query', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let action = req.body.action;

  if (action === 'get_class') {
    function get_class() {
      let query = 'EXEC sp_Course_Class_Get @CourseCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.ccode], (error, results) => {
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

    await get_class();
  }

  if (action === 'get_change_class') {
    function get_change_class() {
      let query = 'EXEC [sp_get_Class_StudentRelated] @ClassCode=?,@StudentCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.class_code, req.body.student_code], (error, results) => {
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

    await get_change_class();
  }

  res.send(return_data);
});

module.exports = router;
