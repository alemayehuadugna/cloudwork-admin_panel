<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col
          :span="6"
          :xs="24"
        >
          <user-card :user="user" />
        </el-col>
        <el-col
          :span="18"
          :xs="24"
        >
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane
                label="Activity"
                firstName="activity"
              >
                <activity />
              </el-tab-pane>
              <el-tab-pane
                label="Timeline"
                firstName="timeline"
              >
                <timeline />
              </el-tab-pane>
              <el-tab-pane
                label="Account"
                firstName="account"
              >
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane
                label="Password"
                firstName="password"
              >
                <password :user="user" />
              </el-tab-pane>

            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { UserModule } from "../../store/index";
import Account from "./components/Account.vue";
import Activity from "./components/Activity.vue";
import Password from "./components/Password.vue";
import Timeline from "./components/Timeline.vue";
import UserCard from "./components/UserCard.vue";

export interface IProfile {
  firstName: string
  lastName: string
  email: string
  profilePicture: string
  roles: string
}

const defaultProfile: IProfile = {
  firstName: "Loading...",
  lastName: "Loading...",
  email: "Loading...",
  profilePicture: "Loading...",
  roles: "Loading...",
};

@Component({
  name: "Profile",
  components: {
    Account,
    Activity,
    Timeline,
    UserCard,
    Password
  }
})
export default class extends Vue {
  private user = defaultProfile
  private activeTab = "activity"
  

  get firstName() {
    return UserModule.firstName;
  }
  get lastName() {
    return UserModule.lastName;
  }

  get email() {
    return UserModule.email;
  }

  get profilePicture() {
    return UserModule.profilePicture;
  }

  get roles() {
    return UserModule.roles;
  }

  created() {
    this.getUser();
  }

  private getUser() {
    this.user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      profilePicture: this.profilePicture,
      roles: this.roles.join(" | "),

    };
  }
}
</script>
