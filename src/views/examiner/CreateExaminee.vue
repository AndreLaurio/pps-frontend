<template>
  <div class="pop">
    <v-layout justify-center>
      <v-flex xs12 md6>
        <v-card class="mx-auto rounded-xl mt-5" max-width="500" v-if="method == 'CREATE'">
          <v-card-title>
            <h3 class="indigo--text mt-5 ml-5">Create Users</h3>
          </v-card-title>
          <v-card-text class="pl-12 pr-12">
            <div class="valsuccess">{{ register_validation_success }}</div>
            <v-radio-group v-model="register_data.user_type_id" row>
              <v-radio color="indigo" label="Examiner" value="2"></v-radio>
              <v-spacer></v-spacer>
              <v-radio color="indigo" label="Examinee" value="3"></v-radio>
            </v-radio-group>
            <v-text-field
              v-model="register_data.first_name"
              :counter="15"
              outlined
              label="First Name"
            ></v-text-field>
            <v-text-field
              v-model="register_data.surname"
              :counter="15"
              outlined
              label="Surname"
            ></v-text-field>
            <v-text-field
              v-model="register_data.email"
              label="Email"
              outlined
              :rules="emailRules"
              :counter="30"
              required
            ></v-text-field>
            <v-text-field
              v-model="register_data.password"
              v-on:keyup.enter="register"
              label="Password"
              outlined
              :rules="[rules.required, rules.min]"
              counter
              hint="At least 8 characters"
              :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_password ? 'text' : 'password'"
              @click:append="show_password = !show_password"
              required
            ></v-text-field>
            <div class="valerror text-center">
              <ul>
                <li v-for="err in register_validation_failed" :key="err.id">
                  {{ err }}
                </li>
              </ul>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              v-on:click="register"
              :loading="registerLoading"
              dark
              outlined
              class="pl-12 pr-12 mb-8 primary"
            >
              Create</v-btn
            >
          </v-card-actions>
        </v-card>


        <v-card class="mx-auto rounded-xl mt-5" max-width="500" v-else-if="method == 'EDIT'">
          <v-card-title>
            <h3 class="indigo--text mt-5 ml-5">Edit User</h3>
          </v-card-title>
          <v-card-text class="pl-12 pr-12">
            <div class="valsuccess">{{ editUser.success }}</div>
            <v-radio-group v-model="user.user_type_id" row>
              <v-radio 
                v-for="ut in user_types" 
                :key="ut.user_type_id"
                color="indigo" 
                :label="ut.user_type" 
                :value="ut.user_type_id"
              ></v-radio> 
            </v-radio-group>
            <v-text-field
              v-model="user.first_name"
              :counter="15"
              outlined
              label="First Name"
            ></v-text-field>
            <v-text-field
              v-model="user.last_name"
              :counter="15"
              outlined
              label="Surname"
            ></v-text-field>
            <v-text-field
              v-model="user.email"
              label="Email"
              outlined
              :rules="emailRules"
              :counter="30"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              v-on:keyup.enter="register"
              label="Password"
              outlined
              :rules="[rules.min]"
              counter
              hint="At least 8 characters"
              :append-icon="show_password ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show_password ? 'text' : 'password'"
              @click:append="show_password = !show_password"
            ></v-text-field>
            <span class="red--text">* If you don't want to update the password, leave it empty</span>
            <div class="valerror text-center">
              <span class="red--text"> {{ editUser.error }} </span>
            </div>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              v-on:click="update()"
              :loading="editUser.loading"
              dark
              outlined
              class="pl-12 pr-12 mb-8 primary"
            >
              Update</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
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
.fcolor {
  color: #760d11;
}
.valerror {
  color: red;
}
.valsuccess {
  color: green;
}
ul {
  list-style-type: none;
}
</style>

<script>
import AdminDashboard from "@/components/admin/Dashboard";
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
        user_type_id: "",
      },
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      show_password: false,
      register_validation_success: "",
      register_validation_failed: [],
      registerLoading: false,

      editUser: {
        success: '',
        error: '',
        loading: false,
      },
      user_types: [
        {'user_type_id': 2, 'user_type': 'Examiner'},
        {'user_type_id': 3, 'user_type': 'Examinee'},
      ],
    };
  },
  props: {
    method: {
      type: String,
      default: 'CREATE',
    },
    user: {
      type: Object,
      default: {}
    }
  },
  components: {
    AdminDashboard,
  },
  mounted() {
    this.loadUser()
  },
  methods: {
    register() {
      this.registerLoading = true;
      axios
        .post("/register", {
          first_name: this.register_data.first_name,
          last_name: this.register_data.surname,
          email: this.register_data.email,
          password: this.register_data.password,
          password_confirmation: this.register_data.password,
          user_type_id: this.register_data.user_type_id,
        })
        .then((response) => {
          this.registerLoading = false;
          this.register_data.first_name = "";
          this.register_data.surname = "";
          this.register_data.email = "";
          this.register_data.password = "";
          this.register_data.password_confirmation = "";
          this.register_validation_success = "The user is successfully added.";
        })
        .catch((error) => {
          this.registerLoading = false;
          let valErr = Object.values(error.response.data.errors);
          valErr = valErr.flat();
          this.register_validation_failed = valErr;
        });
    },
    loadUser() {
      console.log('loadUser')
      console.log(this.method)
      console.log(this.user)
      this.user.password = ''
    },
    update() {
      this.editUser.success = ''
      this.editUser.error = ''
      this.editUser.loading = true

      axios
        .patch(`api/users/${this.user.user_id}`, this.user)
        .then(response => {
            if(response.data.code == 200) {
                this.editUser.success = response.data.message
            }
        })
        .catch(error => {
            console.log('error.response.data')
            this.editUser.error = error.response.data.message
        })
        .finally(() => {
            this.editUser.loading = false
        })
    }
  },
};
</script>
