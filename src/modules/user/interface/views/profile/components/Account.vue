<template>
    <el-form>
        <el-form-item label="First Name">
            <el-input v-model.trim="user.firstName" />
        </el-form-item>
        <el-form-item label="Last Name">
            <el-input v-model.trim="user.lastName" />
        </el-form-item>
        <el-form-item label="Email">
            <el-input v-model.trim="user.email" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit"> Update </el-button>
            
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import { EmployeeStore } from "@/modules/employee/interface/store";
import { Component, Prop, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import { UserStore } from "../../../store/index";
import { IProfile } from "../index.vue";

@Component({
    name: "Account",
})
export default class extends Vue {
    @Prop({ required: true }) private user!: IProfile;

    get profileStore(): UserStore {
        return getModule(UserStore, this.$store);
    }
    id:string="";
    private submit() {
        const firstName = this.user.firstName;
        const lastName = this.user.lastName;
        const email = this.user.email;
        var id=this.id;
        this.profileStore.updateBasicProfile({
          id,
          firstName,
          lastName,
          email,
        })
        this.$message({
            message: "User information has been updated successfully",
            type: "success",
            duration: 5 * 1000,
        });
    }
}
</script>
