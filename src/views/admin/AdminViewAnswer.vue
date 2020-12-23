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
        v-if="loading == false"
        elevation="8 "
        max-width="800"
        outlined
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
      </v-card>

      <v-container>
        <v-divider></v-divider>
      </v-container>

      <v-container>
        <h2 class="pop exam-warning">{{ exam.exam_title }}</h2>

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
                  disabled
                ></v-radio>
              </v-radio-group>
            </div>

            <div v-if="item.question_type_code == 'MCQ'" class="ml-10">
              <p>Please select only {{ item.mcq_max_selection }} choices.</p>
              <div v-for="choice in item.choices" :key="choice.choice_no">
                <v-checkbox
                  :label="choice.label"
                  v-model="choice.is_selected"
                  color="red darken-3"
                  hide-details
                  disabled
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
                readonly
              />
            </div>

            <div v-if="item.question_type_code == 'TOF'" class="ml-10">
              <v-radio-group v-model="item.answer" :mandatory="false">
                <v-radio
                  color="red darken-3"
                  v-for="choice in tofChoices"
                  :key="choice.value"
                  :value="choice.value"
                  :label="choice.text"
                  readonly
                ></v-radio>
              </v-radio-group>
            </div>

            <div>
              <p class="exam-warning ml-10 mt-2" :id="`m-${item_no}`">
                {{ exam.exam_items[item_no].message }}
              </p>
            </div>
          </v-card>
        </v-card-text>

        <v-row justify="center" v-if="loading == false">
          <v-btn class="primary red accent-4" dark @click="back()">
            Back
          </v-btn>
        </v-row>
      </v-container>
    </v-container>

    <v-main>
      <AdminDashboard />
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
  border: 3px solid #760d11;
}
</style>

<script>
import AdminDashboard from "@/components/admin/AdminDashboard";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  data() {
    return {
      exam: {},
      result: [],
      loading: true,
      interval: {},
      value: 0,
      tofChoices: [
        {value: true, text: 'TRUE'},
        {value: false, text: 'FALSE'}
      ]
    };
  },
  props: {
    exam_id: {
      type: Number,
      default: 0,
    },
    exam_title: {
      type: String,
      default: "",
    },
    user_id: {
      type: Number,
      default: 0,
    }
  },
  components: {
    AdminDashboard,
  },
  mounted() {
    this.loadData();
    this.loadingButton();
  },
  // for loading button
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    loadData() {
      if (this.user_id == 0) {
        this.$router.push({
          name: "AdminViewResults",
          params: {
            exam_id: this.exam_id,
            exam_title: this.exam_title,
          },
        });
      } else {
        axios
          .post("/api/exam/examinee/answer/view", {
            user_id: this.user_id,
            exam_id: this.exam_id,
          })
          .then((response) => {
            this.exam = response.data.exam;
            this.result = response.data.result;
            this.loading = false;
          })
          .catch((error) => {
            console.log("Call the Administrator.");
          });
      }
    },
    back() {
      this.$router.push({
        name: "AdminExamination",
        params: {
          exam_id: this.exam_id,
          exam_title: this.exam_title,
        },
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
  },
};
</script>
