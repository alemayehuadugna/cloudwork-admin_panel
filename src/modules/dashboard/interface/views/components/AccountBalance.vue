<template>
  <div class="mixin-components-container">
  <div>
   <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Material Design</span>
          </div>
          <div style="height:100px;">
            <el-form :model="demo" :rules="demoRules">
              <el-form-item prop="title">
                <md-input v-model="demo.title" icon="el-icon-search" name="title" placeholder="asdf">
                  
                </md-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
</template>

<script lang="ts">
export default {
	name: "AccountBalance",
	data() {
		const validate = (rule, value, callback) => {
			if (value.length !== 6) {
				callback(new Error(""));
			} else {
				callback();
			}
		};
		return {
			demo: {
				title: "",
			},
			demoRules: {
				title: [
					{ required: true, trigger: "change", validator: validate },
				],
			},
		};
	},
};
</script>

<style scoped>
.mixin-components-container {
	background-color: #f0f2f5;
	padding: 30px;
	min-height: calc(100vh - 84px);
}
.component-item {
	min-height: 100px;
}
</style>