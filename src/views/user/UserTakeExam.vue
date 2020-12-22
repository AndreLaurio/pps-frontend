<template>
  <div class="pop mt-12 ml-12">
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
    <v-container>
      <v-card
        class="mx-auto rounded-xl card-border"
        elevation="15"
        max-width="800"
        outlined
        v-if="
          is_taking_exam == false && loading == false && has_result == false
        "
      >
        <v-card-title class="mt-5 pl-12">
          <h3 class="pop exam-warning">{{ exam.exam_title }}</h3>
        </v-card-title>
        <v-card-text class="pl-12 mr-5">
          <h3>{{ exam.exam_desc }}</h3>
          <br />
          <div class="exam-warning">
            <b>Time Duration: </b>{{ exam.time_duration }} mins <br />
            <b>Passing Score: </b>{{ exam.passing_score }}/{{
              exam.total_score
            }}
            <br />
            <b>Number of questions: </b>{{ exam.total_num_questions }} <br />
          </div>
          <br />
          <p class="exam-warning mt-2">{{ taking_exam_message }}</p>
        </v-card-text>
        <v-card-actions class="mr-5 mb-5">
          <v-spacer></v-spacer>
          <v-btn
            class="primary red accent-4"
            v-if="continue_exam == false"
            v-on:click="takeExam"
            :loading="loadingTake"
            >Take Exam</v-btn
          >
          <v-btn
            class="primary red accent-4"
            v-if="continue_exam == true"
            v-on:click="takeExam"
            :loading="loadingTake"
            >Continue Exam</v-btn
          >
        </v-card-actions>
      </v-card>

      <v-container v-if="is_taking_exam == true && has_result == false">
        <h2 class="pop exam-warning">{{ exam.exam_title }}</h2>

        <v-banner
          single-line
          :sticky="timer.sticky"
          class="pa-4 mt-4 text-right"
          elevation="1"
        >
          {{ timer.time }}
        </v-banner>

        <v-card-text class="pl-12 pr-12">
          <v-card
            elevation="15"
            v-for="(item, item_no) in exam.exam_items"
            :key="item.item_no"
            class="pa-4 mb-4 rounded-xl"
          >
            <div class="ml-5">
              <v-row>
                <v-col>
                  <span style="display:inline" class="exam-warning mr-1">
                    {{ item.item_no + 1 }}.</span
                  >
                  <span style="display:inline">{{ item.text }}</span>
                </v-col>
              </v-row>
            </div>

            <div v-if="item.question_type_code == 'SCQ'" class="ml-10">
              <v-radio-group v-model="item.answer" :mandatory="false">
                <v-radio
                  color="red darken-3"
                  v-for="choice in item.choices"
                  :key="choice.choice_no"
                  :value="choice.choice_no"
                  :label="choice.label"
                ></v-radio>
              </v-radio-group>
            </div>

            <div v-if="item.question_type_code == 'MCQ'" class="ml-10">
              <p>Please select only {{ item.mcq_max_selection }} choices.</p>
              <div v-for="choice in item.choices" :key="choice.choice_no">
                <v-checkbox
                  :label="choice.label"
                  v-model="choice.is_selected"
                  v-on:change="checkMCQAnswer(item, choice)"
                  color="red darken-3"
                  hide-details
                >
                </v-checkbox>
              </div>
            </div>

            <div v-if="item.question_type_code == 'FTQ'" class="ml-10">
              <v-textarea
                v-model="item.answer"
                :counter="200"
                outlined
                placeholder="Please write your answer."
                :rows="3"
              />
            </div>

            <div>
              <p class="exam-warning ml-10 mt-2" :id="`m-${item_no}`">
                {{ exam.exam_items[item_no].message }}
              </p>
            </div>
          </v-card>
        </v-card-text>

        <v-row justify="center">
          <v-dialog v-model="timer.timerDialogShow" persistent max-width="290">
            <v-card>
              <v-card-title class="pop"><h3>Time's up!</h3></v-card-title>
              <v-card-text>Your time is already finished.</v-card-text>
              <v-card-text
                >Any changes from here will not be saved. Please submit your
                answer.</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="submitAnswer"
                  >Yes, submit my answer</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="submitAnswerDialog" persistent max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="primary red accent-4" dark v-bind="attrs" v-on="on">
                Submit Answer
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="pop"><h3>Submission</h3></v-card-title>
              <v-card-text>Are you sure to submit your answer?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="submitAnswerDialog = false"
                  >No</v-btn
                >
                <v-btn
                  color="primary"
                  text
                  @click="submitAnswer"
                  :loading="loadingSubmit"
                  >Yes, continue</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>

      <v-card
        class="mx-auto rounded-xl card-border"
        elevation="15"
        max-width="800"
        outlined
        v-if="is_taking_exam == false && has_result == true"
      >
        <v-card-title class="mt-5 pl-12">
          <h3 class="pop exam-warning">Exam Result</h3>
        </v-card-title>
        <v-card-text class="pl-12 mr-5">
          <div>
            <b>Examinee no: </b>{{ result.examinee_no }}<br />
            <b>Score: </b>{{ result.overall_score }}/{{ result.total_score }}
            <br />
            <p>
              Wait for admin@gmail.com to message you for interview for details.
            </p>
          </div>
        </v-card-text>
        <v-card-actions class="mr-5 mb-5">
          <v-spacer></v-spacer>
          <v-btn
            class="primary red accent-4"
            v-on:click="printExam"
            :loading="loadingPrint"
            >Print</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-container>

    <v-main>
      <UserDashboard />
    </v-main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
.pop {
  font-family: "Poppins", sans-serif;
}
.exam-warning {
  color: #760d11;
}
.card-border {
  border: 4px solid #760d11;
}
</style>

<script>
import UserDashboard from "@/components/user/UserDashboard";
import axios from "axios";
import moment from "moment";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  data() {
    return {
      submitAnswerDialog: false,
      user_id: "",
      exam: [],
      answers: [],
      message: "",
      is_taking_exam: false,
      answer: 0,
      loading: true,
      loadingTake: false,
      loadingSubmit: false,
      interval: {},
      value: 0,

      loadingPrint: false,
      has_result: false,
      result: {},
      taking_exam_message: "",
      continue_exam: false,

      timer: {
        t: null,
        time: "00:00:00",
        time_start: 0,
        time_duration: 0,
        stop: false,
        save_point: 2, // in seconds
        save_point_counter: 0,

        is_starting_point: true,

        timerDialogShow: false,
        sticky: true,
      },
    };
  },
  components: {
    UserDashboard,
  },
  mounted() {
    this.loadData()
    this.loadingButton()
    this.changetab()
  },
  // for loading button
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    loadData() {
      axios
        .get("/api/user")
        .then((response) => {
          this.user_id = response.data.user_id;
          this.loadExamSession();
        })
        .catch((error) => {
          console.log("Call the Administrator.");
        });
    },
    loadExamSession() {
      axios
        .post("/api/exam/take/session/get", {
          user_id: this.user_id,
        })
        .then((response) => {
          if (response.data.session_exam_id != 0) {
            if (response.data.session_taken_on == null) {
              this.getExamDesc(response.data.session_exam_id);
            } else {
              this.getExamDesc(response.data.session_exam_id);
              this.taking_exam_message = "You already taking this exam.";
              this.continue_exam = true;
            }
          } else {
            this.message = "Please choose an exam to take.";
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log("Call the Administrator.");
        });
    },
    getExamDesc(exam_id) {
      axios
        .get(`/api/exam/desc/${exam_id}`)
        .then((response) => {
          this.exam = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log("Call the Administrator.");
          this.loading = false;
        });
    },
    takeExam() {
      this.loadingTake = true;

      axios
        .get(`/api/exam/items/${this.exam.exam_id}`)
        .then((response) => {
          this.exam.exam_items = response.data.exam_items;
          this.exam.exam_groups = response.data.exam_groups;
          this.is_taking_exam = true;

          axios
            .post("/api/exam/take/session/set", {
              user_id: this.user_id,
              exam: this.exam,
            })
            .then((response) => {
              this.timer.time_duration = response.data.time_duration;
              this.timer.time_start = moment(
                response.data.time_start,
                "YYYY-MM-DD hh:mm:ss"
              );

              if (response.data.exam_status_code == "O") {
                this.exam = response.data.exam;
              }

              this.runTimer();

              this.timer.t = setInterval(() => {
                this.runTimer();
              }, 1000);
            })
            .catch((error) => {
              console.log("Call the Administrator");
            });
        })
        .catch((error) => {
          console.log("Call the Administrator");
        });
    },
    toLetter(index) {
      return String.fromCharCode(index + "A".charCodeAt(0));
    },
    checkMCQAnswer(item, choice) {
      if (item.hasOwnProperty("count_selected") == false) {
        item.count_selected = 0;
      }

      if (choice.is_selected == true) {
        item.count_selected++;
      } else {
        item.count_selected--;
      }

      if (item.count_selected > item.mcq_max_selection) {
        document.getElementById("m-" + item.item_no).innerHTML =
          "You can only choose " + item.mcq_max_selection + " options.";
      } else {
        document.getElementById("m-" + item.item_no).innerHTML = "";
      }
    },
    submitAnswer() {
      this.loadingSubmit = true;
      axios
        .post("/api/exam/check", {
          exam: this.exam,
          user_id: this.user_id,
        })
        .then((response) => {
          this.result = response.data;
          this.has_result = true;
          this.is_taking_exam = false;
          this.submitAnswerDialog = false;
        })
        .catch((error) => {
          this.submitAnswerDialog = false;
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
    printExam() {
      console.log("print");
    },
    continueExam() {
      console.log("continue");
    },
    runTimer() {
      if (this.timer.stop == false) {
        var now = moment();
        var date = moment(this.timer.time_start).add(
          this.timer.time_duration,
          "minutes"
        );
        var s = moment(date).diff(now, "seconds");

        if (s <= 0) {
          this.timer.time = "00:00:00";
          this.timer.stop = true;
          clearInterval(this.timer.t);
          this.timer.timerDialogShow = true;

          if (this.timer.is_starting_point != true) {
            this.saveExamAnswer();
          }
        } else {
          this.timer.time = this.hhmmss(s);
          this.timer.is_starting_point = false;
        }

        if (++this.timer.save_point_counter > this.timer.save_point) {
          this.saveExamAnswer();
          this.timer.save_point_counter = 0;
        }
      }
    },
    saveExamAnswer() {
      axios
        .post("/api/exam/take/save_point", {
          user_id: this.user_id,
          exam_id: this.exam.exam_id,
          exam: this.exam,
        })
        .then((response) => {
          if (response.data.time == "00:00:00") {
            this.timer.time = response.data.time;
            this.timer.stop = true;
          }
        })
        .catch((error) => {
          console.log("Please contact the Administrator.");
        });
    },

    hhmmss(s) {
      var m = Math.floor(s / 60);
      s = s % 60;
      var h = Math.floor(m / 60);
      m = m % 60;
      return `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}`;
    },
    pad(n) {
      return ("0" + n).slice(-2);
    },
    changetab() {
        var self = this;
        document.addEventListener("visibilitychange", function() {
            if (document.hidden) {

                axios.post('/api/exam/take/change-tab', {
                    user_id: self.user_id,
                    exam_id: self.exam.exam_id
                }).then((response) => {
                    
                    console.log('change tab');

                }).catch((error) => {
                    console.log('Please contact the Administrator.')
                })
            }
        });
    }
  }
};
</script>
