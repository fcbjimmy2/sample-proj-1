const config = require('../config');
const express = require('express');
const router = express.Router();
const sql = require("msnodesqlv8");
const fs = require("fs");

router.get('/schedule', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let return_data;
    let ucode;

    function get_myschedule() {
        if (req.query.usercode && req.session.userrole==="Admin") {
            ucode = req.query.usercode;
        } else {
            ucode = req.session.usercode;
        }

        let query = "EXEC [sp_User_Roster_Get] @UserCode=?";

        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [ucode], (error, results) => {
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
        })
    }
    await get_myschedule();

    res.render('schedule', {
        config: config,
        req: req,
        return_data: return_data
    });
});

router.post('/schedule', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let return_data;
    let ucode;
    let action = req.body.action;

    if (action==='get_roster') {

        function get_roster() {
            if (req.body.ucode) {
                ucode = req.body.ucode;
            } else {
                ucode = req.session.usercode;
            }

            let query = "EXEC [sp_User_Roster_Get] @UserCode=?";

            if (config.debug) {
                console.log(query);
                console.log(ucode);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [ucode], (error, results) => {
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
            })
        }
        await get_roster();
    }

    res.send(return_data);

});

router.get('/claims', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let claim_history;
    function get_claims_history() {

        let query = "EXEC [sp_ExpensesClaim_Get] @Applicant=?";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [req.session.usercode], (error, results) => {
                    if (!error) {
                        claim_history = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await get_claims_history();

    function get_claimtype() {
        let query = "Select * FROM [Lookup_EForm_ExpensesType]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query,  (error, results) => {
                    if (!error) {
                        claim_type = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await get_claimtype();

    res.render('claims', {
        config: config,
        req: req,
        claim_history: claim_history,
        claim_type: claim_type
    });
});

router.post('/claims', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let action = req.body.action;
    let return_data;


    if (action === 'update_claim_history') {
        function get_claims_history() {

            let query = "EXEC [sp_ExpensesClaim_Get] @Applicant=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode], (error, results) => {
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
            })
        }
        await get_claims_history();
    }

    if (action === 'save_claim') {
        function save_claim() {
            let query = "[sp_ExpensesClaim_Create] @TempId=?,@Remarks=?,@Applicant=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.body.cartid, req.body.remarks, req.session.usercode], (error, results) => {
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
            })
        }

        await save_claim();
    }

    if (action === 'add_claim_item') {
        function add_claim_item() {
            let query = "[sp_ExpensesClaimTemp_Create] @TempId=?,@ExpensesType=?,@Details=?,@Amount=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.body.cartid, req.body.exp_type, req.body.details, req.body.amount], (error, results) => {
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
            })
        }

        await add_claim_item();
    }

    if (action === 'remove_claim_item') {
        function remove_claim_item() {
            let query = "[sp_ExpensesClaimTemp_Delete] @Id=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.body.Idx], (error, results) => {
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
            })
        }

        await remove_claim_item();
    }
    res.send(return_data);
});

router.post('/chat', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }

    let return_Data;
    let return_MSG;
    let contact_list;
    let R_action = req.body.action;

    if (R_action === "get_msg_status") {
        function get_contact_list() {
            let query = "EXEC sp_User_InboxMessage_User @UserCode=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode], (error, results) => {
                        if (!error) {
                            contact_list = results;
                            resolve();
                            if (!return_MSG) {
                                // if nothing reported, add one here
                                return_MSG = 'Get contact list.';
                            }
                        } else {
                            console.log(error);
                            return_MSG = 'Error.';
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        function checkPhoto(p) {
            let checkPath = config.avator_images + p + '.jpg';
            // console.log(checkPath);
            if (fs.existsSync(checkPath)) {
                //file exists
                photo = 'exist';
                return true;
            } else {
                // file no exists
                photo = 'not_exist';
                // console.log('photo for (' + p + ') not found, use default instead.')
                return false;
            }
        }

        await get_contact_list();
        contact_list.forEach(function (e) {
            if (typeof e === "object") {
                photoExist = checkPhoto(e.UserCode);
                if (photoExist) {
                    e["photo"] = e.UserCode;
                } else {
                    e["photo"] = 'default';
                }

            }
        });
        return_Data = contact_list;
    }

    if (R_action === "send_msg") {
        function send_msg() {
            let query = "EXEC sp_User_InboxMessage_Send @UserCode=?, @TargetUser=?, @Message=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode, req.body.cu, req.body.msg], (error, results) => {
                        if (!error) {
                            return_Data = results;
                            if (config.debug) {
                                console.log("data return : " + JSON.stringify(return_Data));
                            }
                            resolve();
                        } else {
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await send_msg();
    }

    if (R_action === 'get_list') {
        function get_chat() {
            let query = "EXEC sp_User_InboxMessage_Get @UserCode = ?, @TargetUser = ?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode, req.body.cu], (error, results) => {
                        if (!error) {
                            return_Data = results;
                            if (config.debug) {
                                console.log("data return : " + JSON.stringify(return_Data));
                            }
                            resolve();
                        } else {
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await get_chat();
    }

    res.send(return_Data);
});

router.get('/messenger', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    res.render('messenger', {
        config: config,
        req: req,
        message: req.flash('message')
    });
});

router.all('/task', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let returnData;
    let task_list;
    let R_task_id = req.body.task_id;
    let R_action = req.body.action

    function get_TaskList() {
        let query = "select Remarks,TaskID,Task,CreatedBy,DueDate,AssignedTo,AssignedGroup,Completed,CompletedBy,CompletedDate,AssignedToName as AName," +
            "X.Name as CompletedByName,Y.Name as CreatedByName FROM [ToDo] " +
            "left join [User] as X on [Todo].CompletedBy = X.UserCode " +
            "left join [User] as Y on [Todo].CreatedBy = Y.UserCode " +
            "where [Todo].Active = 'True' " +
            "AND (AssignedTo like ? or CreatedBy = ? or AssignedGroup = ?) AND [Todo].Archive=0 order by DueDate asc";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, ['%'+req.session.usercode+'%', req.session.usercode, req.session.userrole], (error, results) => {
                    if (!error) {
                        task_list = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(task_list));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }

    await get_TaskList();
    returnData = task_list;

    if (R_action === "del_task") {
        function del_Task() {
            let query = "Update [ToDo] set [Todo].Active='false' where [Todo].TaskID =? and [Todo].CreatedBy = ?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [R_task_id, req.session.usercode], (error, results) => {
                        if (!error) {
                            if (config.debug) {
                                console.log("query result : " + JSON.stringify(results));
                            }
                            returnData = "Successful";
                            resolve();
                        } else {
                            returnData = "Error";
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await del_Task();
    }

    if (R_action === "chk_task") {
        function chk_Task() {
            let query = "Update [ToDo] set [Todo].Completed='true',CompletedBy=?,CompletedDate=?,Remarks=? where [Todo].TaskID =?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode, new Date(), req.body.remark, R_task_id], (error, results) => {
                        if (!error) {
                            if (config.debug) {
                                console.log("query result : " + JSON.stringify(results));
                            }
                            returnData = "Successful";
                            resolve();
                        } else {
                            returnData = "Error";
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await chk_Task();
    }

    if (R_action === "unchk_task") {
        function unchk_Task() {
            let query = "Update [ToDo] set [Todo].Completed='false',CompletedBy=NULL,CompletedDate=NULL,Remarks=? where [Todo].TaskID =?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.body.remark,R_task_id], (error, results) => {
                        if (!error) {
                            if (config.debug) {
                                console.log("query result : " + JSON.stringify(results));
                            }
                            returnData = "Successful";
                            resolve();
                        } else {
                            returnData = "Error";
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await unchk_Task();
    }

    if (R_action === "add_task") {
        function add_Task() {
            let query = "insert into [ToDo] (Task,CreatedBy,CreateDate,DueDate,AssignedTo,Active) values (?,?,?,?,?,1)";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.body.new_task_input, req.session.usercode, new Date(), new Date(req.body.tdate), req.session.usercode], (error, results) => {
                        if (!error) {
                            if (config.debug) {
                                console.log("query result : " + JSON.stringify(results));
                            }
                            returnData = "Task Added";
                            resolve();
                        } else {
                            returnData = "Error";
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await add_Task();
    }

    if (R_action === undefined) {
        res.render('task', {
            config: config,
            req: req,
            task_list: task_list,
            message: req.flash('message')
        });
    } else {
        res.send(returnData);
    }
});

router.get('/leaves', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let return_data;
    let leaves_apply_history;

    function get_leave_apply_history() {
        let query = "EXEC [sp_LeaveApp_Get] @Applicant=?";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query,[req.session.usercode], (error, results) => {
                    if (!error) {
                        leaves_apply_history = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await get_leave_apply_history();

    function get_leave_type() {
        let query = "Select * FROM [Lookup_EForm_LeaveType]";
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
        })
    }

    await get_leave_type();
    res.render('leaves', {
        config: config,
        req: req,
        return_data: return_data,
        leaves_apply_history: leaves_apply_history
    });
});

router.post('/leaves', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let action = req.body.action;
    console.log(action);

    if (action === 'check_job_sch') {
        function check_job_sch() {
            let query = "[sp_App_LeaveApp_GetAffectedClass] @Applicant=?,@StartDate=?,@EndDate=?,@StrStartTime=?,@StrEndTime=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode, req.body.sdate, req.body.edate, req.body.sapm, req.body.eapm], (error, results) => {
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
            })
        }

        await check_job_sch();
    }

    if (action === 'submit_sch') {
        function submit_sch() {
            let query = "[sp_App_LeaveApp_Create_Internal] @Applicant=?,@StartDate=?,@EndDate=?,@StrStartTime=?,@StrEndTime=?, @LeaveType=?, @Remarks=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode, req.body.sdate, req.body.edate, req.body.sapm, req.body.eapm, req.body.leave_type, req.body.remark], (error, results) => {
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
            })
        }

        await submit_sch();
    }

    if (action === 'delete_sch') {
        function delete_sch() {
            let query = "EXEC [dbo].[sp_LeaveApp_Cancel] @RefNo=?";
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
            })
        }
        await delete_sch();
    }

    if (action === 'update_leaves_history') {
        console.log('get leaves application list');
        function get_leaves_history() {
            let query = "EXEC [sp_LeaveApp_Get] @Applicant=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query,[req.session.usercode], (error, results) => {
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
            })
        }
        await get_leaves_history();
    }
    res.send(return_data);
});

router.get('/punch', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    res.render('punching', {
        config: config,
        req: req,
        message: req.flash('message')
    });
});

router.get('/punchio', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let return_Data;
    let return_sData;

    function punching() {
        let query = "EXEC sp_User_PunchInOut @UserCode = ?, @PunchTime = ?";
        if (config.debug) {
            console.log(query);
        }
        // make sure don't missed anything
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [req.session.usercode, new Date()], (error, results) => {
                    if (!error) {
                        return_Data = results;
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }

    await punching();

    function get_Badge() {
        let query = "EXEC sp_User_Bage_Get @UserCode = ?, @UserRole = ?";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [req.session.usercode, req.session.userrole], (error, results) => {
                    if (!error) {
                        return_Data = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(return_Data));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }

    await get_Badge();
    return_sData = return_Data[0];
    if (req.session.punching && return_Data[0].Status && (req.session.punching !== return_Data[0].Status)) {
        req.session.punching = return_Data[0].Status;
    } else {
        req.session.punching = return_Data[0].Status;
    }
    return_sData.returnMSG = return_Data[0].Status;
    console.log(return_sData);
    res.send(return_sData);
});

router.get('/getClock', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let returnData;
    returnData.clock = new Date();
    console.log(returnData);
    res.send(returnData);
});

router.get('/dashboard', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }

    let total_students;
    let total_new_students;
    let total_withdraw;
    let cash_in_bag;
    let daily_expenses;
    let daily_income;
    let product_count;
    let waiting_list;
    let income_sum;
    let student_sts;
    let expenses_sum;

    function dash1() {
        query = "EXEC [sp_Rpt_Get_TotalStudent]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        total_students = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash1();

    function dash2() {
        query = "EXEC [sp_Rpt_Get_TotalStudentNew]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        total_new_students = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash2();

    function dash3() {
        query = "EXEC [sp_Rpt_Get_TotalStudentWithdraw]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        total_withdraw = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash3();

    function dash4() {
        query = "EXEC [sp_Rpt_Get_CashInBag]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        cash_in_bag = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash4();

    function dash5() {
        query = "EXEC [sp_Rpt_Get_DailyExpense]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        daily_expenses = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash5();

    function dash6() {
        query = "EXEC [sp_Rpt_Get_DailyIncome]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        dailiy_income = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash6();

    function dash7() {
        query = "EXEC [sp_Rpt_Get_ProductCount]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        product_count = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash7();

    function dash8() {
        query = "EXEC [sp_Rpt_Get_WaitingListCount]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        waiting_list = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash8();

    function dash9() {
        query = "EXEC [sp_Rpt_Get_IncomeWeek]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        income_sum = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash9();

    function dash10() {
        query = "EXEC [sp_Rpt_Get_TotalStudentLevel]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        student_sts = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash10();

    function dash11() {
        query = "EXEC [sp_Rpt_Get_ExpenseMonth]";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, (error, results) => {
                    if (!error) {
                        expenses_sum = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }
    await dash11();

    console.log(income_sum)

    res.render('dashboard', {
        config: config,
        req: req,
        total_students: total_students,
        total_new_students: total_new_students,
        total_withdraw: total_withdraw,
        cash_in_bag: cash_in_bag,
        daily_expenses: daily_expenses,
        daily_income: dailiy_income,
        product_count: product_count,
        waiting_list: waiting_list,
        income_sum: income_sum,
        student_sts: student_sts,
        expenses_sum: expenses_sum
    });
});

router.post('/profile', async (req, res, next) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }

    let profile_data;
    let return_MSG;
    let return_Data;
    let R_action = req.body.action

    if (R_action === 'update_profiledata') {
        if (req.body.username && req.body.email && req.body.phone && req.body.defaulthome) {
            // make sure don't missed anything
            function update_Profile() {
                let query = "update [User] set Name=N'" + req.body.username + "',Email='" + req.body.email + "'," +
                    "Phone='" + req.body.phone + "',Default_Home='" + req.body.defaulthome + "' where Login = ?";
                if (config.debug) {
                    console.log(query);
                }
                // make sure don't missed anything
                return new Promise((resolve) => {
                    setTimeout(() => {
                        sql.query(config.db, query, [req.session.user], (error, results) => {
                            if (!error) {
                                resolve();
                            } else {
                                console.log(error);
                            }
                        });
                    }, 10); //1/10 sec
                })
            }

            await update_Profile();
        } else {
            console.log("Something missing, don't update");
            return_MSG = 'Missing Data.';
        }
    }
    if (R_action === 'save_theme') {
        function update_ProfileR() {
            let query = "update [User] set Default_ThemeClass='" + req.body.theme + "' where UserCode = ?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.session.usercode], (error, results) => {
                        if (!error) {
                            return_MSG = 'Theme Set.';
                            req.session.theme = req.body.theme;
                            resolve();
                        } else {
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await update_ProfileR();
    }

    function get_Profile() {
        let query = "select * from [User] where Login = ?";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [req.session.user], (error, results) => {
                    if (!error) {
                        profile_data = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                        if (!return_MSG) {
                            // if nothing reported, add one here
                            return_MSG = 'Profile Updated.';
                        }
                    } else {
                        return_MSG = 'Update Error.';
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }

    await get_Profile();
    return_Data = profile_data[0];
    return_Data.returnMSG = return_MSG;
    // send back updated data
    console.log(return_Data);
    res.send(return_Data);
});

router.get('/profile', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }

    let profile_data;

    function get_Profile() {
        let query = "select * from [User] where Login = ?";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [req.session.user], (error, results) => {
                    if (!error) {
                            console.log('----------------------------------------------------------------------------------profile data----------------------------------------------------------------------------------')
    console.log(results);
                        profile_data = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }

    await get_Profile();
    res.render('user_profile', {
        config: config,
        req: req,
        profile_data: profile_data,
        message: req.flash('message')
    });
});

router.get('/check_badge', async (req, res) => {

    let return_Data;

    function get_Badge() {
        let query = "EXEC sp_User_Bage_Get @UserCode = ?, @UserRole = ?";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [req.session.usercode, req.session.userrole], (error, results) => {
                    if (!error) {
                        return_Data = results;
                        if (config.debug) {
                            console.log("USER: " + req.session.user + " : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }

    await get_Badge();
    if (req.session.punching !== return_Data[0].Status) {
        // update session status
        req.session.punching = return_Data[0].Status;
    }
    res.send(return_Data);
});

router.post('/reset_password', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    let returnData;

    function reset_pw() {
        let query = "EXEC sp_User_Edit_Password @UserCode=?,@Password=?";
        if (config.debug) {
            console.log(query);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                sql.query(config.db, query, [req.session.usercode, req.body.passwd], (error, results) => {
                    if (!error) {
                        returnData = results;
                        if (config.debug) {
                            console.log("data return : " + JSON.stringify(results));
                        }
                        resolve();
                    } else {
                        console.log(error);
                    }
                });
            }, 10); //1/10 sec
        })
    }

    await reset_pw();
    res.send(returnData);
});

router.post('/assign_user', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }

    let return_data;
    let action = req.body.action;

    if (action === "assign_to") {
        function assign_Task() {
            let query = "Update [ToDo] set [Todo].AssignedTo=?,[Todo].AssignedToName=? where [Todo].TaskID =? and [Todo].CreatedBy = ?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [req.body.new_user,req.body.new_username,req.body.task_id, req.session.usercode], (error, results) => {
                        if (!error) {
                            if (config.debug) {
                                console.log("query result : " + JSON.stringify(results));
                            }
                            returnData = "Successful";
                            resolve();
                        } else {
                            returnData = "Error";
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }
        await assign_Task();
    }


    if (action === 'get_user') {
        function get_user_list() {
            let query = "Select * from [User] where Active=?";
            if (config.debug) {
                console.log(query);
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [1], (error, results) => {
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
            })
        }

        await get_user_list();
    }
    res.send(return_data)
});

module.exports = router;
