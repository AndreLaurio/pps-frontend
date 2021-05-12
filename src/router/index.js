import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home";

//Examinee
import Examinee from "../views/examinee/Index";
import ExamineeExamination from "../views/examinee/Examination";
import ExamineeProfile from "../components/Profile";
import ExamineeTakeExam from "../views/examinee/TakeExam";

//Examiner
import Examiner from "../views/examiner/Index";
import ExaminerExamination from "../views/examiner/Examination";
import ExaminerExaminees from "../views/examiner/Examinees";
import ExaminerCreateExamination from "../views/examiner/CreateExamination";
import ExaminerManageExaminees from "../views/examiner/ManageExaminees";
import ExaminerViewResults from "../views/examiner/ViewResults";
import ExaminerEditExam from "../views/examiner/EditExam";
import ExaminerViewExam from "../views/examiner/ViewExam";
import ExaminerViewAnswer from "../views/examiner/ViewAnswer";

//Examiner
import Admin from "../views/admin/Index";
import AdminManageUsers from "../views/admin/ManageUsers";
import AdminManageExams from "../views/admin/ManageExams";
import AdminCreateUser from "../views/examiner/CreateExaminee";
import AdminAccountApproval from "../views/examiner/AccountApproval";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/examinee",
    name: "Examinee",
    component: Examinee,
  },
  {
    path: "/examinee/examination",
    name: "ExamineeExamination",
    component: ExamineeExamination,
  },
  {
    path: "/examinee/profile",
    name: "ExamineeProfile",
    component: ExamineeProfile,
  },
  {
    path: "/examinee/exam/take",
    name: "ExamineeTakeExam",
    component: ExamineeTakeExam,
  },
  {
    path: "/examiner",
    name: "Examiner",
    component: Examiner,
  },
  {
    path: "/examiner/examinees",
    name: "ExaminerExaminees",
    component: ExaminerExaminees,
  },
  {
    path: "/examiner/exams",
    name: "ExaminerExamination",
    component: ExaminerExamination,
    props: true,
  },
  {
    path: "/examiner/exam/create",
    name: "ExaminerCreateExamination",
    component: ExaminerCreateExamination,
  },
  {
    path: "/examiner/exam/examinees",
    name: "ExaminerManageExaminees",
    component: ExaminerManageExaminees,
    props: true,
  },
  {
    path: "/examiner/exam/results",
    name: "ExaminerViewResults",
    component: ExaminerViewResults,
    props: true,
  },
  {
    path: "/examiner/exam/edit",
    name: "ExaminerEditExam",
    component: ExaminerEditExam,
    props: true,
  },
  {
    path: "/examiner/exam/view",
    name: "ExaminerViewExam",
    component: ExaminerViewExam,
    props: true,
  },
  {
    path: "/examiner/exam/examinee/answer/view",
    name: "ExaminerViewAnswer",
    component: ExaminerViewAnswer,
    props: true,
  },

  // Admin
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/admin/users",
    name: "AdminManageUsers",
    component: AdminManageUsers,
  },
  {
    path: "/admin/exams",
    name: "AdminManageExams",
    component: AdminManageExams,
  },
  {
    path: "/admin/users/create",
    name: "AdminCreateUser",
    component: AdminCreateUser,
    props: true
  },
  {
    path: "/admin/account-approval",
    name: "AdminAccountApproval",
    component: AdminAccountApproval,
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
