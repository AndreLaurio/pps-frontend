<template>
  <div class="pop ml-12 mt-12">
    <v-layout row wrap>
      <v-flex>
        <h1>Create Examination</h1>
      </v-flex>
    </v-layout>

    <v-layout row wrap class="mt-5">
      <v-flex xs12 sm12 md10 xl7>
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <h3 class="colored-title">Exam Description</h3>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card-text class="pl-12 pr-12">
                <v-text-field
                  v-model="exam.exam_title"
                  :counter="50"
                  outlined
                  label="Title"
                />
                <v-textarea
                  v-model="exam.exam_desc"
                  :counter="200"
                  outlined
                  label="Description"
                />

                <v-text-field
                  v-model="exam.time_duration"
                  type="number"
                  outlined
                  label="Time Duration (in minutes)"
                  :rules="tdRules"
                />
                <v-text-field
                  v-model="exam.passing_score"
                  type="number"
                  outlined
                  label="Passing Score"
                />

                <!-- <v-switch  color="red darken-3" v-model="exam.is_randomized" label="Randomized Questions" /> -->
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel class="mt-3">
            <v-expansion-panel-header>
              <h3 class="colored-title">Exam Questions</h3>
            </v-expansion-panel-header>

            <v-expansion-panel-content>
              <v-card-text class="pl-12 pr-12">
                <v-card
                  elevation="15"
                  v-for="(item, item_no) in exam.exam_items"
                  :key="item.item_no"
                  class="pa-4 mb-4"
                >
                  <v-textarea
                    v-model="item.text"
                    :counter="200"
                    outlined
                    :label="`Question #${item_no + 1}`"
                    :rows="3"
                  />

                  <v-row>
                    <v-col cols="12" offset-md="8" md="4">
                      <v-select
                        v-model="item.question_type_code"
                        :items="question_types"
                        item-value="question_type_code"
                        item-text="question_type"
                        label="Type"
                        small
                        outlined
                      />
                    </v-col>
                  </v-row>

                  <v-container
                    v-if="
                      item.question_type_code == 'SCQ' ||
                        item.question_type_code == 'MCQ'
                    "
                  >
                    <v-divider />

                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Letter</th>
                            <th class="text-left">Label</th>
                            <th class="text-left">Correct Answer</th>
                            <th class="text-left">Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(choice, choice_no) in item.choices"
                            :key="choice_no"
                          >
                            <td>{{ toLetter(choice_no) }}</td>
                            <td>
                              <v-textarea
                                class="mt-2"
                                v-model="choice.label"
                                :counter="200"
                                outlined
                                label="Label"
                                :rows="2"
                              />
                            </td>
                            <td>
                              <v-switch
                                color="red darken-3"
                                v-model="choice.is_correct"
                                v-on:change="validateIsCorrect(item, choice_no)"
                              />
                            </td>
                            <td>
                              <v-btn
                                color="#760D11"
                                dark
                                v-on:click="
                                  deleteChoice(item.choices, choice_no)
                                "
                                ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                              >
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr v-if="item.question_type_code == 'MCQ'">
                            <td colspan="5">
                              <v-text-field
                                class="mt-2"
                                v-model="item.mcq_max_selection"
                                type="number"
                                outlined
                                label="Max number of choices to be selected"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td colspan="5">
                              <v-alert
                                dense
                                outlined
                                type="error"
                                :value="item.alert"
                              >
                                {{ item.message }}
                              </v-alert>
                            </td>
                          </tr>
                          <tr>
                            <td class="pa-2" colspan="4">
                              <v-btn
                                small
                                outlined
                                class="primary rounded-lg"
                                dark
                                v-on:click="addChoice(item)"
                              >
                                Add a choice
                              </v-btn>
                            </td>
                          </tr>
                        </tfoot>
                      </template>
                    </v-simple-table>
                  </v-container>
                </v-card>

                <v-btn
                  small
                  class="primary rounded-lg"
                  outlined
                  dark
                  v-on:click="addQuestion"
                >
                  Add a question
                </v-btn>
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>

      <v-container>
        <v-row>
          <v-btn
            :loading="loadingAddEx"
            dark
            outlined
            class="primary rounded-lg"
            v-on:click="addExamination"
          >
            Add the examination
          </v-btn>
        </v-row>
      </v-container>
    </v-layout>

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

.valerror {
  color: red;
}
.colored-title {
  color: #760d11;
}
</style>

<script>
import AdminDashboard from "@/components/admin/AdminDashboard";
import axios from "axios";

import _ from "lodash";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  components: {
    AdminDashboard,
  },
  data() {
    return {
      exam: {},
      exam_item: {},
      exam_group: {},
      exam_choice: {},

      tdRules: [
        (v) => !!v || "Required",
        (v) => v >= 0 || "Time Duration should be greater than 0 min.",
      ],

      message: "sample",
      question_types: {},
      loadingAddEx: false,
    };
  },
  mounted() {
    this.getFreshExamObj();
  },
  methods: {
    getFreshExamObj() {
      axios
        .get("/api/exam/fresh")
        .then((response) => {
          this.exam = response.data.exam;
          this.exam_item = response.data.exam_item;
          this.exam_group = response.data.exam_group;
          this.question_types = response.data.question_types;
          this.exam_choice = response.data.exam_choice;

          this.exam.exam_groups = [];
          this.exam.exam_groups.push(_.cloneDeep(this.exam_group));

          // Removing NNE choice
          let i = this.question_types
            .map((item) => item.question_type_code)
            .indexOf("NNE");
          this.question_types.splice(i, 1);
        })
        .catch((error) => {
          console.log("Please call the Administrator");
        });
    },
    addExamination() {
      this.loadingAddEx = true;

      //random code generator
      var result = "";
      var length = 6;
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      this.exam.exam_code = result;

      axios
        .post("/api/exam/create", this.exam)
        .then((response) => {
          this.loadingAddEx = false;
          this.$router.push({
            name: "AdminExamination",
            params: {
              success: "The exam is successfully created.",
            },
          });
        })
        .catch((error) => {
          this.loadingAddEx = false;
        });
    },
    addQuestion() {
      this.exam.exam_items.push(_.cloneDeep(this.exam_item));
    },
    addChoice(item) {
      console.log("add choice");

      if (item.choices.length >= 26) {
        item.message = "You reached the maximum number of choices.";
        item.alert = true;
      } else {
        item.choices.push(_.cloneDeep(this.exam_choice));
      }
    },
    toLetter(index) {
      return String.fromCharCode(index + "A".charCodeAt(0));
    },
    deleteChoice(choices, choice_no) {
      choices.splice(choice_no, 1);
      console.log("delete choice");
    },
    validateIsCorrect(item, choice_no) {
      if (item.question_type_code == "MCQ") {
        return;
      }

      if (
        item.question_type_code == "SCQ" &&
        item.choices[choice_no].is_correct == true
      ) {
        item.choices.forEach((choice, key) => {
          if (choice.is_correct == true && key != choice_no) {
            choice.is_correct = false;
          }
        });
      } else {
      }
    },
  },
};
</script>
