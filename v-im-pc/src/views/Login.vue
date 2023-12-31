<template>
  <div class="login-box">
    <Top></Top>
    <el-form v-if='!router.currentRoute.value.query.username' class="login" ref="formRef" :model="form" label-width="60px">
      <div class="title">V-IM 登录</div>
      <el-form-item label="用户名" class="item">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" class="item">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code" v-if="captchaOnOff" class="item">
        <el-input
          v-model="form.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
        >
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>
      <el-form-item label="主机" class="item">
        <el-input v-model="form.host" @blur="flush()">
          <template #append>
            <el-button @click="flush()">刷新</el-button>
          </template>
        </el-input>
      </el-form-item>
      <div class="el-row">
        <div class="el-col-12">
          <el-button type="info" @click="router.push('/register')"
            >注册</el-button
          >
        </div>
        <div class="el-col-12">
          <div class="text-right">
            <el-button type="primary" @click="submit">登录</el-button>
            <el-button>取消</el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import Auth from "@/api/Auth";
import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/chatStore";
import UserApi from "@/api/UserApi";
import { getCodeImg, login } from "@/api/Login";
import Top from "@/components/Top.vue";
import VimConfig from "@/config/VimConfig";

const router = useRouter();
const userStore = useUserStore();
const chatStore = useChatStore();

const form = reactive({
  name: "",
  password: "",
  code: "",
  uuid: "",
  host: VimConfig.host,
});

const submit = () => {
  const reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  if (!reg.test(form.host)) {
    ElMessage.error("主机地址不对");
    return;
  }
  Auth.setIp(form.host);
  login(form.name, form.password, form.code, form.uuid)
    .then((res: any) => {
      Auth.setToken(res.token);
      return UserApi.currentUser();
    })
    .then((res) => {
      let user = res.data;
      userStore.storeUser(user.id, { name: user.name, avatar: user.avatar });
      userStore.setUser(user);
      chatStore.reloadChats();
      router.push("/index/chat");
    });
};

// 验证码开关
const captchaOnOff = ref(true);
const codeUrl = ref("");

const getCode = () => {
  getCodeImg().then((res: any) => {
    Auth.setIp(form.host);
    captchaOnOff.value =
      res.captchaOnOff === undefined ? true : res.captchaOnOff;
    if (captchaOnOff.value) {
      codeUrl.value = "data:image/gif;base64," + res.img;
      form.uuid = res.uuid;
    }
  });
};

/**
 * 刷新主机
 */
const flush = () => {
  Auth.setIp(form.host);
  getCode();
};
const defaultSubmit = () => {
// 如果是跳转过来的，则直接登录
  const username = router.currentRoute.value.query.username
  if(username){
    form.name = username
    form.password = 'admin123'
    form.code = '--'
    submit()
  }
}
onMounted(() => {
  Auth.isLogin()
    .then((res) => {
      if (res) {
        router.push("/index/chat");
      }
    })
    .catch((err) => {
      console.error(err);
    });

  getCode();
  form.host = Auth.getIp();

  defaultSubmit();


});
</script>

<style scoped lang="scss">
.login-box {
  background: url("../assets/bg.png") no-repeat;
  background-size: 100% 100%;
  height: 100%;
  box-shadow: #cccccc 10px 10px 10px;

  .logo-box {
    display: flex;
    justify-content: center;
    text-align: center;

    .logo {
      width: 15rem;
      height: 100%;
    }
  }

  .login {
    width: 50rem;
    margin: 10rem auto;
    background-color: rgba(#fff, 0.5);
    padding: 30px;

    .title {
      padding: 15px;
      text-align: center;
      font-size: 2rem;
      color: #5fb878;
    }
  }

  .login-code {
    flex: 1;
    height: 32px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
