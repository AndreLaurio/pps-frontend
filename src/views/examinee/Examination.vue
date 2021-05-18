<template>
  <div class="pop mt-5 ml-12">
    <v-btn
      outlined
      dark
      class="primary rounded-lg pl-12 pr-12"
      @click="joinRoomDialog = true"
      >Join Exam</v-btn
    >
    <!-- Join Exam pop up -->
    <v-dialog v-model="joinRoomDialog" persistent max-width="550">
      <v-card class="font-body rounded-lg">
        <v-card-title class="pl-8 pr-8 pt-8 justify-center">
          Enter Room Code
        </v-card-title>
        <v-card-text>
          <v-text-field
            prepend-inner-icon=""
            clearable
            v-model="exam_code"
            outlined
            class="ml-12 mr-12"
          ></v-text-field>
          <div class="text-right">
            <v-btn
              dark
              outlined
              @click="joinRoom"
              class="primary mr-2 text-uppercase rounded-lg"
            >
              Join
            </v-btn>
            <v-btn
              color="indigo"
              outlined
              @click="joinRoomDialog = false"
              class="text-uppercase rounded-lg"
            >
              Close
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div class="text-center mr-12">
      <v-progress-circular
        v-if="loading == true"
        :rotate="90"
        :size="100"
        :width="15"
        :value="value"
        color="indigo"
      >
        {{ value }}
      </v-progress-circular>
    </div>
    <v-layout v-if="result.show == false">
      <v-flex>
        <v-row class="justify-center">
          <div v-if="isEmpty == true">
            <br />
            <img
              class="ml-12"
              src="../../assets/error_asset.png"
              width="400"
              height="300"
            />
          </div>
          <v-card
            v-for="exam in exams"
            :key="exam.exam_id"
            width="300"
            height="400px"
            class="ml-5 mt-5 d-flex flex-column"
          >
            <v-card-title class="colored-title">
              {{ exam.exam_title }}
            </v-card-title>
            <v-card-text>
              {{ exam.exam_desc }}
            </v-card-text>
            <v-spacer></v-spacer>
            <v-card-actions class="mb-3">
              <p
                v-if="exam.exam_status_code == 'F'"
                class="red--text mt-3 ml-5"
              >
                Finished
              </p>
              <v-spacer></v-spacer>
              <v-btn
                v-if="exam.exam_status_code == 'N'"
                dark
                outlined
                class="primary rounded-lg"
                v-on:click="takeExam(exam.exam_id)"
                >Take Exam</v-btn
              >
              <v-btn
                v-if="exam.exam_status_code == 'O'"
                dark
                outlined
                class="primary rounded-lg"
                v-on:click="takeExam(exam.exam_id)"
                >Continue Exam</v-btn
              >
              <v-btn
                v-if="exam.exam_status_code == 'F'"
                dark
                outlined
                class="primary rounded-lg"
                @click="viewResult(exam.exam_id)"
                >View Result</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-row>
      </v-flex>

      <v-row justify="center">
        <v-dialog v-model="dialog.show" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">{{ dialog.title }}</v-card-title>
            <v-card-text>{{ dialog.message }}</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog.show = false"
                >Got it</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-layout>

    <v-layout v-if="result.show == true">
      <v-card
        class="mx-auto rounded-xl card-border"
        elevation="8"
        max-width="800"
        outlined
        id="section-to-print"
      >
        <v-card-title class="mt-5 pl-12">
          <h3 class="pop exam-warning">Exam Result</h3>
        </v-card-title>
        <v-card-text class="pl-12 mr-5">
          <div class="exam-warning">
            <b>Examinee no: </b>{{ result.examinee_no }}<br />
            <b>Score: </b>{{ result.overall_score }}/{{ result.total_score }}
            <br />
            <p>
              Wait for admin@gmail.com to message you for interview for details.
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="mr-5 mb-5 no-to-print">
          <v-spacer></v-spacer>
          <v-btn
            dark
            outlined
            class="primary rounded-lg no-to-print"
            v-on:click="result.show = false"
            >Back</v-btn
          >
          <v-btn dark outlined class="primary rounded-lg no-to-print" v-on:click="printExam"
            >Print</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-layout>

    <v-main>
      <ExamineeDashboard />
    </v-main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
.pop {
  font-family: "Poppins", sans-serif;
}
.colored-title {
  color: #760d11;
}
.card-border {
  border: 3px solid #760d11;
}

@media print {
  body * {
    visibility: hidden;
  }
  #section-to-print:not(.no-to-print), #section-to-print *:not(.no-to-print) {
    visibility: visible;
  }
  #section-to-print {
    position: absolute;
    width: 100%;
    left: -25%;
  }
  .no-to-print {
    visibility: hidden;
  }
}
</style>

<script>
import ExamineeDashboard from "@/components/examinee/Dashboard";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  data() {
    return {
      user_id: "",
      exams: [],
      message: "sample",
      loading: true,
      isEmpty: false,
      joinRoomDialog: false,
      exam_code: "",
      interval: {},
      value: 0,
      dialog: {
        show: false,
        title: "",
      },
      result: {
        show: false,
        examinee_no: "",
        overall_score: 0,
        total_score: 0,
      },
    };
  },
  components: {
    ExamineeDashboard,
  },
  mounted() {
    this.load(), this.loadingButton();
  },
  // for loading button
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    load() {
      axios.get("/api/user").then((response) => {
        this.user_id = response.data.user_id;
        this.loadExams();
      });
    },
    loadExams() {
      axios
        .post("/api/examinee/exams", {
          user_id: this.user_id,
        })
        .then((response) => {
          // this.exams = response.data
          let a = response.data;
          if (a == "") {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
            this.exams = response.data;
          }

          console.log("test");
          console.log(this.exams);
          this.loading = false;
        })
        .catch((error) => {
          console.log("Please call the adminsitrator");
        });
    },
    takeExam(exam_id) {
      axios
        .post("/api/exam/take/intro", {
          user_id: this.user_id,
          exam_id: exam_id,
        })
        .then((response) => {
          if (response.data.status == "success") {
            this.$router.push({ name: "ExamineeTakeExam" });
          } else if (response.data.status == "error") {
            this.dialog.title = "Examination Dialog";
            this.dialog.message = response.data.message;
            this.dialog.show = true;
          }
        })
        .catch((error) => {
          console.log("Call the Administrator");
        });
    },
    loadingButton() {
      this.interval = setInterval(() => {
        if (this.value === 100) {
          return (this.value = 0);
        }
        this.value += 10;
      }, 1000);
    },
    viewResult(exam_id) {
      axios
        .post("/api/examinee/exam/result", {
          user_id: this.user_id,
          exam_id: exam_id,
        })
        .then((response) => {
          if (response.data.status == "success") {
            this.result.examinee_no = response.data.examinee_no;
            this.result.overall_score = response.data.overall_score;
            this.result.total_score = response.data.total_score;

            this.result.show = true;
          }
        })
        .catch((error) => {
          console.log("Call the Administrator");
        });
    },
    printExam() {
      
      console.log("print");
      window.print();
    },
    joinRoom() {
      axios
        .post("/api/exam/examinee/code/add", {
          user_id: this.user_id,
          exam_code: this.exam_code,
        })
        .then((response) => {
          console.log("joined room successfully");
          this.loading = true
          this.loadExams()
          this.joinRoomDialog = false
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    },
  },
};
</script>
