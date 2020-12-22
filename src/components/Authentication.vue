<template>
  <div class="template fill-height font-body">
    <v-container class="mt-12" justify="center">
      <div class="text-center">
        <img src="../assets/vixam_logo.png" />
        <h1 class="mt-3 mb-2 for-title">Sign in to your account</h1>
        <span class="grey--text text--darken-1">Or</span>
        <v-dialog v-model="registerDialog" persistent max-width="550">
          <template v-slot:activator="{ on, attrs }">
            <span class="indigo--text" v-bind="attrs" v-on="on"
              > create your own account</span
            >
          </template>
          <v-card class="register-card font-body rounded-lg">
            <v-card-title class="pl-8 pr-8 pt-8 justify-center">
              <span class="text-center text-uppercase rounded-lg indigo--text"
                >Register Form</span
              >
            </v-card-title>
            <v-card-text>
              <div class="ml-8 mr-8">
                <v-row>
                  <v-col>
                    <label
                      for="first-name"
                      class="text-md-body-1 register-input"
                    >
                      First Name</label
                    >
                    <v-text-field
                      outlined
                      clearable
                      id="first-name"
                      v-model="register_data.first_name"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <label
                      for="last-name"
                      class="text-md-body-1 register-input"
                    >
                      Last Name</label
                    >
                    <v-text-field
                      outlined
                      clearable
                      id="last-name"
                      v-model="register_data.last_name"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
              <div class="ml-8 mr-8">
                <label for="register-email" class="text-md-body-1">
                  Email Address</label
                >
                <v-text-field
                  outlined
                  prepend-inner-icon="mdi-email-outline"
                  clearable
                  id="register-email"
                  v-model="register_data.email"
                ></v-text-field>
              </div>
              <div class="ml-8 mr-8">
                <div>
                  <label for="register-password" class="text-md-body-1">
                    Password</label
                  >
                  <v-text-field
                    outlined
                    id="register-password"
                    :append-icon="
                      showPasswordRegister ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :rules="[rules.required, rules.min]"
                    :type="showPasswordRegister ? 'text' : 'password'"
                    name="input-10-2"
                    hint="At least 8 characters"
                    class="input-group--focused"
                    @click:append="showPasswordRegister = !showPasswordRegister"
                    prepend-inner-icon="mdi-key-variant"
                    v-model="register_data.password"
                  ></v-text-field>
                </div>
                <div>
                  <label for="register-confirm-password" class="text-md-body-1">
                    Confirm Password</label
                  >
                  <v-text-field
                    outlined
                    id="register-confirm-password"
                    :append-icon="
                      showPasswordRegisterConfirm ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    :rules="[rules.required, rules.min]"
                    :type="showPasswordRegisterConfirm ? 'text' : 'password'"
                    name="input-10-2"
                    hint="At least 8 characters"
                    class="input-group--focused"
                    @click:append="
                      showPasswordRegisterConfirm = !showPasswordRegisterConfirm
                    "
                    prepend-inner-icon="mdi-key-variant"
                    v-model="register_data.confirm_password"
                  ></v-text-field>
                </div>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <div class="mb-2">
                <v-btn
                  dark
                  outlined
                  @click="register"
                  class="primary text-uppercase rounded-lg mr-2"
                >
                  Register
                </v-btn>
                <v-btn
                  color="indigo"
                  outlined
                  @click="registerDialog = false"
                  class="text-uppercase rounded-lg"
                >
                  Close
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <v-card class="mt-5 mx-auto" width="500">
        <v-card-text>
          <div class="ml-8 mr-8 pt-10">
            <label for="email" class="text-md-body-1"> Email Address</label>
            <v-text-field
              solo
              prepend-inner-icon="mdi-email-outline"
              clearable
              id="email"
              v-model="login_data.email"
              class="input-login"
            ></v-text-field>
            <label for="password" class="text-md-body-1"> Password</label>
            <v-text-field
              solo
              id="password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-2"
              hint="At least 8 characters"
              class="input-group--focused input-login"
              @click:append="showPassword = !showPassword"
              prepend-inner-icon="mdi-key-variant"
              v-model="login_data.password"
            ></v-text-field>
            <div class="text-right mr-5">
              <v-dialog v-model="forgotPwDialog" persistent max-width="550">
                <template v-slot:activator="{ on, attrs }">
                  <span class="indigo--text" v-bind="attrs" v-on="on"
                    >Forgot your password?</span
                  >
                </template>
                <v-card class="register-card font-body">
                  <v-card-title class="pl-8 pr-8 pt-8 justify-center">
                    <span
                      class="text-center text-uppercase text-lg-h6 indigo--text"
                      >Reset Password</span
                    >
                  </v-card-title>
                  <v-card-text>
                    <div class="ml-8 mr-8">
                      <label for="register-email" class="text-md-body-1">
                        Email Address</label
                      >
                      <v-text-field
                        outlined
                        prepend-inner-icon="mdi-email-outline"
                        clearable
                        id="register-email"
                        v-model="forgotPw_data.email"
                      ></v-text-field>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <div class="mb-2">
                      <v-btn
                        outlined
                        dark
                        @click="forgotPassword"
                        class="primary text-uppercase rounded-lg mr-2"
                      >
                        Send Email
                      </v-btn>
                      <v-btn
                        outlined
                        color="indigo"
                        @click="forgotPwDialog = false"
                        class="text-uppercase rounded-lg"
                      >
                        Close
                      </v-btn>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </div>
          <div class="text-center mt-2">
            <div>
              <ul>
                <li
                  v-for="valErr in validationError"
                  :key="valErr.id"
                  class="red--text"
                >
                  {{ valErr }}
                </li>
              </ul>
            </div>
            <div>
              <span class="red--text">{{ waitingError }}</span>
            </div>
            <v-btn
              depressed
              color="primary"
              class="signin pr-12 pl-12"
              v-on:click="login"
              :loading="loginLoading"
              >Sign in</v-btn
            >
          </div>
          <v-row align="center" class="pr-12 pl-12 mt-5">
            <v-divider></v-divider>
            <span class="pr-3 pl-3 text-md-body-1">Or continue with</span>
            <v-divider></v-divider>
          </v-row>
          <div class="mt-5 pr-12 pl-12 mb-4">
            <v-btn class="ml-3 pr-10 pl-10" @click="snackbar = true"
              ><v-icon>mdi-facebook</v-icon></v-btn
            >
            <v-btn class="ml-3 mr-3 pr-10 pl-10" @click="snackbar = true"
              ><v-icon>mdi-twitter</v-icon></v-btn
            >
            <v-btn class="pr-10 pl-10" @click="snackbar = true"
              ><v-icon>mdi-github</v-icon></v-btn
            >
          </div>
        </v-card-text>
      </v-card>
      <!-- snackbar -->
      <v-snackbar v-model="snackbar" :timeout="timeout">
        <div class="text-center">
          <span>Under Maintenance</span>
        </div>
      </v-snackbar>
    </v-container>

    <!-- register alerts -->
    <v-dialog v-model="registerSuccessful" persistent max-width="550">
      <v-card class="font-body rounded-lg">
        <v-card-title class="pl-8 pr-8 pt-8 justify-center">
          Registered Successfully
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="mb-2">
            <v-btn
              color="indigo"
              outlined
              @click="registerSuccess"
              class="text-uppercase rounded-lg"
            >
              Ok
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="registerFailed" persistent max-width="550">
      <v-card class="font-body rounded-lg">
        <v-card-title class="pl-8 pr-8 pt-8 justify-center">
          Registered failed please contact the administrator!
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="mb-2">
            <v-btn
              color="indigo"
              outlined
              @click="registerFail"
              class="text-uppercase rounded-lg"
            >
              Ok
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
.pop {
  font-family: "Poppins", sans-serif;
}
.ifSelected {
  border-bottom: 1px solid #d50000;
}
.below-img {
  color: white;
}
a {
  text-decoration: none;
}
.valerror {
  color: red;
}
.valsuccess {
  color: green;
}
.regsuccess {
  color: white;
}
ul {
  list-style-type: none;
}
</style>

<script>
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  data() {
    return {
      register_data: {
        first_name: "",
        surname: "",
        email: "",
        password: "",
        confirm_password: "",
      },
      login_data: {
        email: "",
        password: "",
      },
      forgotPw_data: {
        email: "",
      },
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      fRules: [(v) => !!v || "First name is required"],
      sRules: [(v) => !!v || "Surname is required"],
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      snackbar: false,
      timeout: 2000,
      loginLoading: false,
      showPassword: false,
      showPasswordRegister: false,
      showPasswordRegisterConfirm: false,
      registerDialog: false,
      forgotPwDialog: false,
      registerSuccessful: false,
      waitingError: "",
      registerFailed: false,
      validationError: [],
    };
  },
  mounted() {
    // this.changetab();
  },
  methods: {
    login() {
      this.loginLoading = true;
      axios
        .get("/sanctum/csrf-cookie")
        .then((response) => {
          axios
            .post("/login", {
              email: this.login_data.email,
              password: this.login_data.password,
            })
            .then((response) => {
              axios.get("api/user").then((response) => {
                let is_approved = response.data.is_approved;
                var userType = response.data.user_type_id;
                console.log(is_approved);
                if (userType == 1) {
                  if (is_approved == 1) {
                    this.$router.push({
                      name: "UserExamination",
                    });
                  } else {
                    this.loginLoading = false;
                    this.waitingError = "Waiting for Approval";
                  }
                } else if (userType == 2) {
                  this.$router.push({
                    name: "Admin",
                  });
                }
              });
            })
            .catch((error) => {
              //   let validationErrors = Object.values(error.response.data.errors);
              //   validationErrors = validationErrors.flat();
              //   this.validationError = validationErrors;
              //   this.loginLoading = false;
              console.log(error);
            });
        })
        .catch((error) => {
          console.log("sanctum error");
          this.loginLoading = false;
        });
    },
    register() {
      axios
        .post("/register", {
          first_name: this.register_data.first_name,
          last_name: this.register_data.last_name,
          email: this.register_data.email,
          password: this.register_data.password,
          password_confirmation: this.register_data.confirm_password,
          user_type_id: 1,
        })
        .then((response) => {
          this.registerSuccessful = true;
        })
        .catch((error) => {
          this.registerFailed = true;
        });
    },
    forgotPassword() {
      axios
        .post("/password/email", {
          email: this.forgotPw_data.email,
        })
        .then((response) => {
          console.log("sent successfully");
        })
        .catch((error) => {
          console.log("sending failed");
        });
    },
    registerSuccess() {
      this.registerSuccessful = false;
      this.registerDialog = false;
      window.location.reload();
    },
    registerFail() {
      this.registerFailed = false;
      this.registerDialog = false;
      window.location.reload();
    },
    changetab() {
      document.addEventListener("visibilitychange", function() {
        if (document.hidden) {
          console.log("nagpalitngtab");
        }
      });
    },
  },
};
</script>
