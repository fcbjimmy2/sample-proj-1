const config = require('../config');
const express = require('express');
const router = express.Router();
const sql = require('msnodesqlv8');

router.get('/create_courses_and_items', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  res.render('create_courses_and_items', {
    config: config,
    req: req
  });
});

router.get('/list_courses_and_items', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let products;
  let course_info;
  const userBranchCodes = req.session.branchcode.split(',');
  function get_course_info() {
    let query = 'EXEC [sp_Course_Get]';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            console.log('----------------course info----------------');
            console.log(results);
            course_info = results.filter((item) => userBranchCodes.includes(item.BranchCode));
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

  function get_all_products() {
    let query = 'EXEC [sp_Product_Get]';
    if (config.debug) {
      console.log(query);
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        sql.query(config.db, query, (error, results) => {
          if (!error) {
            products = results;
            if (config.debug) {
              // console.log("data return : " + JSON.stringify(results));
            }
            resolve();
          } else {
            console.log(error);
          }
        });
      }, 10); //1/10 sec
    });
  }

  await get_all_products();
  await get_course_info();
  res.render('list_courses_and_items', {
    config: config,
    req: req,
    products: products,
    course_info: course_info
  });
});

router.post('/prod_create', async (req, res) => {
  if (config.debug) {
    console.log(req.session);
    console.log(req.body);
  } else {
    console.log(req.session.user);
  }
  let return_data;
  let query;
  let action = req.body.action;
  let form = req.body.form;

  if (action === 'get_coursecode') {
    function get_coursecode() {
      query = 'SELECT [CourseCode],[CourseTitle]  FROM [Course]  where active=1';
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

    await get_coursecode();
  }

  if (action === 'get_course_details_bycode') {
    function get_course_details_bycode() {
      query =
        'SELECT [Recurring],[CourseCode],[CourseMasterCode],[CourseType],[CourseTitle],[CourseDesc],[CourseRemark],[CourseInternalRemark],[InvoiceItemDesc]' +
        ',[Year],[Form],[Subject],[CourseStart],[CourseEnd],[CourseActiveDate],[CourseDeactiveDate],[CourseQuota],[CourseMinLimit],[MethodCode]' +
        ',[CoursePrice],[TeacherCode],[Course].VenueCode,[Course].Active,[Course].BranchCode,[Course].CreateBy,[Course].CreateDate,[Venue].VenueName' +
        ',[Course].RecurDaysBefore, [Course].[Recurring]' +
        ',[User].Name FROM [Course] ' +
        ' left join [Venue] on [Course].VenueCode = [Venue].VenueCode' +
        ' left join [User] on [Course].TeacherCode = [User].UserCode' +
        ' where [Course].[active]=? and [CourseCode]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [1, req.body.ccode], (error, results) => {
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

    await get_course_details_bycode();
  }

  if (action === 'get_mastercode') {
    function get_mastercode() {
      query = 'SELECT distinct [CourseMasterCode] as MasterCode,[CourseTitle] FROM [Course] order by [CourseMasterCode]';
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

    await get_mastercode();
  }

  if (action === 'get_teacherlist') {
    function get_teacherlist() {
      query = 'SELECT [UserCode],[Name] FROM [User] where [Role]=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, ['Teacher'], (error, results) => {
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

    await get_teacherlist();
  }

  if (action === 'get_branches') {
    function get_branches() {
      query = 'SELECT BranchCode FROM [SysCompany]';
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

    await get_branches();
  }

  if (action === 'check_mcode') {
    function check_mcode() {
      query = 'SELECT [CourseCode],[CourseMasterCode] FROM [Course] where [CourseMasterCode]=?';
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

    await check_mcode();
  }

  if (action === 'check_ccode') {
    function check_ccode() {
      query = 'SELECT [CourseCode],[CourseMasterCode] FROM [Course] where [CourseCode]=?';
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

    await check_ccode();
  }

  if (action === 'check_teacher') {
    function check_teacher() {
      query = 'Exec [sp_CourseTempSchedule_CheckTeacher] @TempID=?,@TeacherCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.tempid, req.body.teacher_code], (error, results) => {
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

    await check_teacher();
  }

  if (action === 'check_venue') {
    function check_venue() {
      query = 'Exec [sp_CourseTempSchedule_CheckVenue] @TempID=?,@VenueCode=?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.tempid, req.body.venue_code], (error, results) => {
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

    await check_venue();
  }

  if (action === 'get_venues') {
    function get_venues() {
      query = 'SELECT [BranchCode],[VenueCode],[VenueName],[Remarks] FROM [Venue] where Active=? order by BranchCode';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, ['1'], (error, results) => {
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

    await get_venues();
  }

  if (action === 'get_tempid') {
    function get_tempid() {
      query = 'EXEC [Generate_UID]';
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

    await get_tempid();
  }

  if (action === 'add_temp_row') {
    function add_temp_row() {
      query = 'EXEC [sp_CourseTempSchedule_Step1] @TempID = ?,@TempRowID =?,@WeekDay =?,@StartTime = ?,@EndTime = ?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [req.body.tempid, req.body.temprowid, req.body.wdays, req.body.stime, req.body.etime],
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

    await add_temp_row();
  }

  if (action === 'remove_temp_row') {
    function remove_temp_row() {
      query = 'EXEC [sp_CourseTempSchedule_Delete] @TempRowID =?';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.temprowid], (error, results) => {
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

    await remove_temp_row();
  }

  if (action === 'confirm_schedule') {
    function confirm_schedule() {
      if (req.body.no_of_class > 0) {
        // use class #
        query = 'EXEC [sp_CourseTempSchedule_Step2] @TempID =?,@NoofClass=?,@DateStart=?';
        if (config.debug) {
          console.log(query);
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            sql.query(config.db, query, [req.body.tempid, req.body.no_of_class, req.body.start_date], (error, results) => {
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
      } else {
        query = 'EXEC [sp_CourseTempSchedule_Step2] @TempID =?,@DateStart=?,@DateEnd=?';
        if (config.debug) {
          console.log(query);
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            sql.query(config.db, query, [req.body.tempid, req.body.start_date, req.body.end_date], (error, results) => {
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
    }

    await confirm_schedule();
  }

  if (action === 'save_course') {
    let s;
    let f_cmcode;
    let f_ccode;
    let f_ctype;
    let f_ctitle;
    let f_cdesc;
    let f_cremark;
    let teachercode;
    let venuecode;
    let f_ciremark;
    let en_start_date;
    let en_end_date;
    let f_price;
    let f_cpaymethod;
    let min_student;
    let max_student;
    let f_form;
    let f_subject;
    let branchcode;
    let daysbefore;

    console.log('---------------------------------------req.body---------------------------------------');
    console.log(req.body.c_startd);
    console.log(req.body.c_endd);

    let parms = form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('f_cmcode=')[1];
      if (s !== undefined) {
        f_cmcode = decodeURIComponent(s);
      }
      s = parms[i].split('f_ccode=')[1];
      if (s !== undefined) {
        f_ccode = decodeURIComponent(s);
      }
      s = parms[i].split('f_ctype=')[1];
      if (s !== undefined) {
        f_ctype = decodeURIComponent(s);
      }
      s = parms[i].split('f_ctitle=')[1];
      if (s !== undefined) {
        f_ctitle = decodeURIComponent(s);
      }
      s = parms[i].split('f_cdesc=')[1];
      if (s !== undefined) {
        f_cdesc = decodeURIComponent(s);
      }
      s = parms[i].split('f_cremark=')[1];
      if (s !== undefined) {
        f_cremark = decodeURIComponent(s);
      }
      s = parms[i].split('teachercode=')[1];
      if (s !== undefined) {
        teachercode = s;
      }
      s = parms[i].split('venuecode=')[1];
      if (s !== undefined) {
        venuecode = decodeURIComponent(s);
      }
      s = parms[i].split('f_ciremark=')[1];
      if (s !== undefined) {
        f_ciremark = decodeURIComponent(s);
      }
      s = parms[i].split('en_start_date=')[1];
      if (s !== undefined) {
        en_start_date = s;
      }
      s = parms[i].split('en_end_date=')[1];
      if (s !== undefined) {
        en_end_date = s;
      }
      s = parms[i].split('f_price=')[1];
      if (s !== undefined) {
        f_price = s;
      }
      s = parms[i].split('f_cpaymethod=')[1];
      if (s !== undefined) {
        f_cpaymethod = s;
      }
      s = parms[i].split('min_student=')[1];
      if (s !== undefined) {
        min_student = s;
      }
      s = parms[i].split('max_student=')[1];
      if (s !== undefined) {
        max_student = s;
      }
      s = parms[i].split('year=')[1];
      if (s !== undefined) {
        year = decodeURIComponent(s);
      }
      s = parms[i].split('f_form=')[1];
      if (s !== undefined) {
        f_form = decodeURIComponent(s);
      }
      s = parms[i].split('f_subject=')[1];
      if (s !== undefined) {
        f_subject = decodeURIComponent(s);
      }
      s = parms[i].split('branchcode=')[1];
      if (s !== undefined) {
        branchcode = decodeURIComponent(s);
      }
      s = parms[i].split('recurring=')[1];
      if (s !== undefined) {
        recurring = s;
      }
      s = parms[i].split('daysbefore=')[1];
      if (s !== undefined) {
        daysbefore = s;
      }
    }

    console.log('form: ' + form);
    console.log('------------------');
    console.log('id: ' + req.body.tempid);
    console.log('code: ' + f_ccode);
    console.log('master: ' + f_cmcode);
    console.log('type: ' + f_ctype);
    console.log('title: ' + f_ctitle);
    console.log('desc: ' + f_cdesc);
    console.log('remark: ' + f_cremark);
    console.log('recur: ' + f_ciremark);
    console.log('year: ' + year);
    console.log(f_form);
    console.log(f_subject);
    console.log('course_start_date: ' + req.body.c_startd);
    console.log('course_end_date: ' + req.body.c_endd);
    console.log('start_date: ' + en_start_date);
    console.log('end_date: ' + en_end_date);
    console.log(max_student);
    console.log(min_student);
    console.log(f_price);
    console.log(f_cpaymethod);
    console.log(teachercode);
    console.log(venuecode);
    console.log(branchcode);
    console.log(recurring);
    console.log(daysbefore);
    console.log(req.session.usercode);
    console.log('------------------');

    function save_course() {
      query =
        'EXEC [sp_Course_Create] @TempID=?, @RecurDaysBefore=?, @Recurring=?, @CourseCode=?,@CourseMasterCode=?,@CourseType=?,@CourseTitle=?,@CourseDesc=?,@CourseRemark=?,@CourseInternalRemark=?,@Year=?,@Form=?,@Subject=?,@CourseStart=?,@CourseEnd=?,@CourseEnrollStart=?,@CourseEnrollEnd=?,@CourseMaxStu=?,@CourseMinStu=?,@CoursePrice=?,@MethodCode=?,@TeacherCode=?,@VenueCode=?,@BranchCode=?,@UserCode=?';

      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              req.body.tempid,
              daysbefore,
              recurring,
              f_ccode,
              f_cmcode,
              f_ctype,
              f_ctitle,
              f_cdesc,
              f_cremark,
              f_ciremark,
              year,
              f_form,
              f_subject,
              req.body.c_startd,
              req.body.c_endd,
              en_start_date,
              en_end_date,
              max_student,
              min_student,
              f_price,
              f_cpaymethod,
              teachercode,
              venuecode,
              branchcode,
              req.session.usercode
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

    await save_course();
  }

  if (action === 'update_course') {
    let s;
    let f_ccode;
    let f_ctype;
    let f_ctitle;
    let f_cdesc;
    let f_cremark;
    let f_ciremark;
    let en_start_date;
    let en_end_date;
    let f_price;
    let min_student;
    let max_student;
    let f_form;
    let f_subject;
    let daysbefore;

    let parms = form.split('&');
    for (let i = 0; i < parms.length; i++) {
      s = parms[i].split('f_ccode=')[1];
      if (s !== undefined) {
        f_ccode = decodeURIComponent(s);
      }
      s = parms[i].split('f_ctype=')[1];
      if (s !== undefined) {
        f_ctype = decodeURIComponent(s);
      }
      s = parms[i].split('f_ctitle=')[1];
      if (s !== undefined) {
        f_ctitle = decodeURIComponent(s);
      }
      s = parms[i].split('f_cdesc=')[1];
      if (s !== undefined) {
        f_cdesc = decodeURIComponent(s);
      }
      s = parms[i].split('f_cremark=')[1];
      if (s !== undefined) {
        f_cremark = decodeURIComponent(s);
      }
      s = parms[i].split('f_ciremark=')[1];
      if (s !== undefined) {
        f_ciremark = decodeURIComponent(s);
      }
      s = parms[i].split('en_start_date=')[1];
      if (s !== undefined) {
        en_start_date = s;
      }
      s = parms[i].split('en_end_date=')[1];
      if (s !== undefined) {
        en_end_date = s;
      }
      s = parms[i].split('f_price=')[1];
      if (s !== undefined) {
        f_price = s;
      }
      s = parms[i].split('min_student=')[1];
      if (s !== undefined) {
        min_student = s;
      }
      s = parms[i].split('max_student=')[1];
      if (s !== undefined) {
        max_student = s;
      }
      s = parms[i].split('year=')[1];
      if (s !== undefined) {
        year = decodeURIComponent(s);
      }
      s = parms[i].split('f_form=')[1];
      if (s !== undefined) {
        f_form = decodeURIComponent(s);
      }
      s = parms[i].split('f_subject=')[1];
      if (s !== undefined) {
        f_subject = decodeURIComponent(s);
      }
      s = parms[i].split('recurring=')[1];
      if (s !== undefined) {
        recurring = s;
      }
      s = parms[i].split('daysbefore=')[1];
      if (s !== undefined) {
        daysbefore = s;
      }
    }

    if (en_start_date.includes('%2F')) {
      let hold;
      en_start_date = en_start_date.replaceAll('%2F', '-');
      en_start_date = en_start_date.split('-');
      hold = en_start_date[0];
      en_start_date[0] = en_start_date[2];
      en_start_date[2] = hold;
      hold = en_start_date[2];
      en_start_date[2] = en_start_date[1];
      en_start_date[1] = hold;
      en_start_date = en_start_date.join('-');
    }

    if (en_end_date.includes('%2F')) {
      let hold;
      en_end_date = en_end_date.replaceAll('%2F', '-');
      en_end_date = en_end_date.split('-');
      hold = en_end_date[0];
      en_end_date[0] = en_end_date[2];
      en_end_date[2] = hold;
      hold = en_end_date[2];
      en_end_date[2] = en_end_date[1];
      en_end_date[1] = hold;
      en_end_date = en_end_date.join('-');
    }

    console.log(form);
    console.log('------------------');
    console.log(f_ccode);
    console.log(f_ctype);
    console.log(f_ctitle);
    console.log(f_cdesc);
    console.log(f_cremark);
    console.log(f_ciremark);
    console.log(year);
    console.log(f_form);
    console.log(f_subject);
    console.log(en_start_date);
    console.log(en_end_date);
    console.log(max_student);
    console.log(min_student);
    console.log(f_price);
    console.log(recurring);
    console.log(daysbefore);
    console.log('------------------');

    function update_course() {
      query =
        'EXEC [sp_Course_Edit] @RecurDaysBefore=?, @Recurring=?, @CourseCode=?,@CourseType=?,@CourseTitle=?,@CourseDesc=?,@CourseRemark=?,@CourseInternalRemark=?,@Year=?,@Form=?,@Subject=?,@CourseEnrollmentStart=?,@CourseEnrollmentEnd=?,@CourseQuota=?,@CourseMinLimit=?,@CoursePrice=?,@Active=?';

      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(
            config.db,
            query,
            [
              daysbefore,
              recurring,
              f_ccode,
              f_ctype,
              f_ctitle,
              f_cdesc,
              f_cremark,
              f_ciremark,
              year,
              f_form,
              f_subject,
              en_start_date,
              en_end_date,
              max_student,
              min_student,
              f_price,
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

    await update_course();
  }

  if (action === 'get_course_list') {
    function get_course_info() {
      let query = 'EXEC [sp_Course_Get]';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, (error, results) => {
            if (!error) {
              return_data = results;
              if (config.debug) {
                // console.log("data return : " + JSON.stringify(results));
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
  }

  if (action === 'get_productcode') {
    function get_productcode() {
      query = 'SELECT * FROM [Product] where [Active]=1 order by [ProductCode] ';
      if (req.body.productcode !== undefined) {
        // just get this one
        query = "SELECT * FROM [Product] where [ProductCode] = '" + req.body.productcode + "'";
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

    await get_productcode();
  }

  if (action === 'check_productcode') {
    function check_productcode() {
      query = 'SELECT * FROM [Product] where [ProductCode]=? ';
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

    await check_productcode();
  }

  if (action === 'save_product') {
    console.log(req.body);
    let code = req.body.code;
    let name = req.body.name;
    let desc = req.body.desc;
    let cat = req.body.cat;
    let cost = req.body.cost;
    let price = req.body.price;
    let stock = req.body.stock;
    let voucher = req.body.voucher;
    let quantity = req.body.qty;

    function save_product() {
      query =
        "EXEC [sp_Product_Action] @Action='Create', @ProductCode=?,@ProductName=?,@ProductDescription=?,@ProductCat=?,@ProductCost=?,@ProductPrice=?,@Stockable=?,@Voucher=?,@Qty=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [code, name, desc, cat, cost, price, stock, voucher, quantity], (error, results) => {
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
    await save_product();
  }

  if (action === 'update_product') {
    let code = req.body.code;
    let name = req.body.name;
    let desc = req.body.desc;
    let cat = req.body.cat;
    let cost = req.body.cost;
    let price = req.body.price;
    let stock = req.body.stock;
    let voucher = req.body.voucher;
    let quantity = req.body.qty;

    function update_product() {
      console.log(req.body, 'hello');
      query =
        "EXEC [sp_Product_Action] @Action='EDIT', @ProductCode=?,@ProductName=?,@ProductDescription=?,@ProductCat=?,@ProductCost=?,@ProductPrice=?,@Stockable=?,@Voucher=?,@Qty=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [code, name, desc, cat, cost, price, stock, voucher, quantity], (error, results) => {
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
    await update_product();
  }

  if (action === 'delete_product') {
    let code = req.body.code;
    let name = req.body.name;
    let desc = req.body.desc;
    let cat = req.body.cat;
    let cost = req.body.cost;
    let price = req.body.price;
    let stock = req.body.stock;
    let voucher = req.body.voucher;
    let quantity = req.body.qty;

    function delete_product() {
      query =
        "EXEC [sp_Product_Action] @Action='DELETE', @ProductCode=?,@ProductName=?,@ProductDescription=?,@ProductCat=?,@ProductCost=?,@ProductPrice=?,@Stockable=?,@Voucher=?,@Qty=?";
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [code, name, desc, cat, cost, price, stock, voucher, quantity], (error, results) => {
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
    await delete_product();
  }

  if (action === 'delete_course') {
    let ccode = req.body.ccode;

    function delete_course() {
      query = 'EXEC [dbo].[sp_Course_Delete] @CourseCodeList=?';
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
    await delete_course();
  }

  if (action === 'add_ta') {
    function add_ta() {
      query = 'insert into [CourseTA] ([CourseCode],[TeacherCode]) values(?,?)';
      if (config.debug) {
        console.log(query);
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          sql.query(config.db, query, [req.body.ccode, req.body.ta], (error, results) => {
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
    await add_ta();
  }

  res.send(return_data);
});

module.exports = router;
