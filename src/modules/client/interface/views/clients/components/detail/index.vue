<template>
  <div>
    <div style="margin: 30px">
      <div class="title">
        <h2>Client Detail</h2>
      </div>
      <el-row :gutter="30" class="panel-group">
        <el-col :xs="40" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-wrapper">
              <div class="card-panel-image">
                <div class="image wrapper">
                  <img
                    v-if="selectedClient.profilePicture"
                    :src="selectedClient.profilePicture"
                    alt=""
                  />
                  <img v-else src="@/assets/profile.png" alt="" />
                </div>
                <div class="detail-wrapper">
                  <div class="card-panel-detail">
                    <div class="profile">
                      <h2>
                        {{
                          selectedClient.firstName +
                          " " +
                          selectedClient.lastName
                        }}

                        <i
                          v-if="selectedClient.verified"
                          class="el-icon-success"
                          style="color: green"
                        />
                      </h2>
                      <p v-if="selectedClient.companyName">
                        {{ selectedClient.companyName }}
                      </p>
                      <p v-else class="profile-company" style="color: #ccc">
                        no company
                      </p>
                    </div>
                    <div class="">
                      <span v-if="selectedClient.websiteUrl"
                        ><i class="el-icon-circle-check" />
                        <a href="#">{{ selectedClient.websiteUrl }}</a></span
                      >
                      <span style="color: #bbb">no company site</span>
                    </div>
                  </div>
                  <div class="panel-rate">
                    <span class="">
                      {{ selectedClient.address.city }},
                      {{ selectedClient.address.region }}</span
                    >
                    <p>
                      <span>{{ selectedClient.rating.rate.toFixed(1) }}</span>
                      <el-rate v-model="selectedClient.rating.rate"></el-rate>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <el-divider><i class="el-icon-star-on"></i></el-divider>
            <div class="card-dividers">
              <div class="divider-item">
                <span>{{selectedClient.completedJobs}}</span>
                <h4>Completed Jobs</h4>
              </div>
              <el-divider direction="vertical"></el-divider>
              <div class="divider-item">
                <span>{{selectedClient.ongoingJobs}}</span>
                <h4>Ongoing Jobs</h4>
              </div>
              <el-divider direction="vertical"> </el-divider>
              <div class="divider-item">
                <span>{{selectedClient.cancelledJobs}}</span>
                <h4>Cancelled Jobs</h4>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="30" :sm="30" :lg="16" class="card-panel-col">
          <div class="card-panel user-bio">
            <h3>Overview</h3>
            <div>
              <p v-if="selectedClient.description">
                {{ selectedClient.description }}
              </p>
              <p v-else style="color: #bbb">no overview</p>
            </div>
          </div>
        </el-col>
        <el-col :xs="30" :sm="30" :lg="8" class="card-panel-col">
          <el-row class="card-panel-profile">
            <div class="user-bio-section-body">
              <div class="progress-item">
                <h3>Profile Completness</h3>
                <el-progress :percentage="51" style="margin-top: 10px" />
              </div>
            </div>
          </el-row>
          <el-row class="card-panel-profile">
            <div class="user-bio-section-body">
              <p style="font-size: 22px">Social Accounts</p>
              <div class="" style="padding-left: 10px" v-if="selectedClient.socialLinks.length > 0">
                <ol>
                  <li v-for="link in selectedClient.socialLinks" :key="link"><span>link.link</span></li>
                </ol>
                
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { ClientStore } from "@/modules/client/interface/store";
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

@Component({
  name: "ClientDetail",
})
export default class extends Vue {
  private data = "";
  private selectedClient = {};

  get clientStore(): ClientStore {
    return getModule(ClientStore, this.$store);
  }

  private async getClient(id: string) {
    await this.clientStore.getClient(id);
    this.selectedClient = this.clientStore.selectedClient;
  }
  mounted() {
    this.data = this.$route.params.id;
    this.getClient(this.$route.params.id);
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  width: 100%;
  text-align: center !important;
  justify-content: center;
  margin: auto;

  h2 {
    font-weight: 700;
    font-size: 45px;
    color: #ff5b37;
    margin-bottom: 15px;
  }
}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    height: auto;
  }

  .card-panel {
    padding-top: 30px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    .card-panel-wrapper {
      margin: 0 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .detail-wrapper {
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      margin-left: 20px;
      .card-panel-detail {
        display: flex;
        flex-flow: column;
        justify-content: space-evenly;

        .profile {
          h2 {
            font-weight: 400;
            // font-size: 36px;
            font-weight: bold;
            color: #161c2d;
          }

          p {
            font-size: 16px;
            color: #ff5b37;
          }

          .profile-company {
            font-size: 16px;
            color: #eee;
          }
        }
      }
      .panel-rate {
        display: inline-flex;
        align-items: center;

        span {
          margin-right: 15px;
        }

        p {
          display: flex;

          span {
            font-size: 11px;
            background-color: #febe42;
            border-radius: 5px;
            color: #fff;
            font-weight: 500;
            width: 22px;
            height: 22px;
            line-height: 20px;
            padding: 2px;
            align-items: center;
            margin-right: 7px;
            justify-content: center;
          }
        }
      }

      panel-verify {
        align-items: center;
      }
    }

    .card-panel-image {
      display: flex;
      justify-content: space-evenly;
    }
  }

  .card-panel-profile {
    height: 50%;
    padding-top: 30px;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
  }

  .card-dividers {
    display: flex;
    justify-content: space-evenly;

    .divider-item {
      display: inline-flex;
      align-items: center;

      h4 {
        margin-left: 10px;
      }
    }
  }

  .user-bio {
    padding: 0 20px;
    h3 {
      font-weight: bold;
      font-size: 22px;
      position: relative;
      color: #161c2d;
      padding-bottom: 10px;
      margin-bottom: 15px;
      border-bottom: 1px solid #e6e6e6;
    }
    h3::after {
      height: 3px;
      content: "";
      position: absolute;
      width: 11px;
      background: #ff5b37;
      bottom: 0;
      left: 32px;
    }
    h3::before {
      height: 3px;
      content: "";
      position: absolute;
      width: 29px;
      background: #ff5b37;
      bottom: 0;
      left: 0;
    }

    p {
      font-size: 16px;
      line-height: 200%;
    }
  }

  .user-bio-section-body {
    padding: 0 15px 15px 15px;

    .progress-item {
      h3 {
        font-weight: bold;
        font-size: 22px;
        position: relative;
        color: #161c2d;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }

      h3::after {
        height: 3px;
        content: "";
        position: absolute;
        width: 11px;
        background: #ff5b37;
        bottom: 0;
        left: 32px;
      }
      h3::before {
        height: 3px;
        content: "";
        position: absolute;
        width: 29px;
        background: #ff5b37;
        bottom: 0;
        left: 0;
      }
    }
  }
}
</style>>
