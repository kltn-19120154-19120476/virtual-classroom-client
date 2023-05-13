(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[495],{31812:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return LoadingButton_LoadingButton}});var objectWithoutPropertiesLoose=__webpack_require__(63366),esm_extends=__webpack_require__(87462),react=__webpack_require__(67294),capitalize=__webpack_require__(98216),useId=__webpack_require__(27909),composeClasses=__webpack_require__(94780),styled=__webpack_require__(90948),useThemeProps=__webpack_require__(71657),Button=__webpack_require__(83321),CircularProgress=__webpack_require__(98456),generateUtilityClass=__webpack_require__(34867),generateUtilityClasses=__webpack_require__(1588);function getLoadingButtonUtilityClass(slot){return(0,generateUtilityClass.Z)("MuiLoadingButton",slot)}let loadingButtonClasses=(0,generateUtilityClasses.Z)("MuiLoadingButton",["root","loading","loadingIndicator","loadingIndicatorCenter","loadingIndicatorStart","loadingIndicatorEnd","endIconLoadingEnd","startIconLoadingStart"]);var jsx_runtime=__webpack_require__(85893);let _excluded=["children","disabled","id","loading","loadingIndicator","loadingPosition","variant"],useUtilityClasses=ownerState=>{let{loading,loadingPosition,classes}=ownerState,slots={root:["root",loading&&"loading"],startIcon:[loading&&`startIconLoading${(0,capitalize.Z)(loadingPosition)}`],endIcon:[loading&&`endIconLoading${(0,capitalize.Z)(loadingPosition)}`],loadingIndicator:["loadingIndicator",loading&&`loadingIndicator${(0,capitalize.Z)(loadingPosition)}`]},composedClasses=(0,composeClasses.Z)(slots,getLoadingButtonUtilityClass,classes);return(0,esm_extends.Z)({},classes,composedClasses)},rootShouldForwardProp=prop=>"ownerState"!==prop&&"theme"!==prop&&"sx"!==prop&&"as"!==prop&&"classes"!==prop,LoadingButtonRoot=(0,styled.ZP)(Button.Z,{shouldForwardProp:prop=>rootShouldForwardProp(prop)||"classes"===prop,name:"MuiLoadingButton",slot:"Root",overridesResolver:(props,styles)=>[styles.root,styles.startIconLoadingStart&&{[`& .${loadingButtonClasses.startIconLoadingStart}`]:styles.startIconLoadingStart},styles.endIconLoadingEnd&&{[`& .${loadingButtonClasses.endIconLoadingEnd}`]:styles.endIconLoadingEnd}]})(({ownerState,theme})=>(0,esm_extends.Z)({[`& .${loadingButtonClasses.startIconLoadingStart}, & .${loadingButtonClasses.endIconLoadingEnd}`]:{transition:theme.transitions.create(["opacity"],{duration:theme.transitions.duration.short}),opacity:0}},"center"===ownerState.loadingPosition&&{transition:theme.transitions.create(["background-color","box-shadow","border-color"],{duration:theme.transitions.duration.short}),[`&.${loadingButtonClasses.loading}`]:{color:"transparent"}},"start"===ownerState.loadingPosition&&ownerState.fullWidth&&{[`& .${loadingButtonClasses.startIconLoadingStart}, & .${loadingButtonClasses.endIconLoadingEnd}`]:{transition:theme.transitions.create(["opacity"],{duration:theme.transitions.duration.short}),opacity:0,marginRight:-8}},"end"===ownerState.loadingPosition&&ownerState.fullWidth&&{[`& .${loadingButtonClasses.startIconLoadingStart}, & .${loadingButtonClasses.endIconLoadingEnd}`]:{transition:theme.transitions.create(["opacity"],{duration:theme.transitions.duration.short}),opacity:0,marginLeft:-8}})),LoadingButtonLoadingIndicator=(0,styled.ZP)("div",{name:"MuiLoadingButton",slot:"LoadingIndicator",overridesResolver(props,styles){let{ownerState}=props;return[styles.loadingIndicator,styles[`loadingIndicator${(0,capitalize.Z)(ownerState.loadingPosition)}`]]}})(({theme,ownerState})=>(0,esm_extends.Z)({position:"absolute",visibility:"visible",display:"flex"},"start"===ownerState.loadingPosition&&("outlined"===ownerState.variant||"contained"===ownerState.variant)&&{left:"small"===ownerState.size?10:14},"start"===ownerState.loadingPosition&&"text"===ownerState.variant&&{left:6},"center"===ownerState.loadingPosition&&{left:"50%",transform:"translate(-50%)",color:(theme.vars||theme).palette.action.disabled},"end"===ownerState.loadingPosition&&("outlined"===ownerState.variant||"contained"===ownerState.variant)&&{right:"small"===ownerState.size?10:14},"end"===ownerState.loadingPosition&&"text"===ownerState.variant&&{right:6},"start"===ownerState.loadingPosition&&ownerState.fullWidth&&{position:"relative",left:-10},"end"===ownerState.loadingPosition&&ownerState.fullWidth&&{position:"relative",right:-10})),LoadingButton=react.forwardRef(function(inProps,ref){let props=(0,useThemeProps.Z)({props:inProps,name:"MuiLoadingButton"}),{children,disabled=!1,id:idProp,loading=!1,loadingIndicator:loadingIndicatorProp,loadingPosition="center",variant="text"}=props,other=(0,objectWithoutPropertiesLoose.Z)(props,_excluded),id=(0,useId.Z)(idProp),loadingIndicator=null!=loadingIndicatorProp?loadingIndicatorProp:(0,jsx_runtime.jsx)(CircularProgress.Z,{"aria-labelledby":id,color:"inherit",size:16}),ownerState=(0,esm_extends.Z)({},props,{disabled,loading,loadingIndicator,loadingPosition,variant}),classes=useUtilityClasses(ownerState),loadingButtonLoadingIndicator=loading?(0,jsx_runtime.jsx)(LoadingButtonLoadingIndicator,{className:classes.loadingIndicator,ownerState:ownerState,children:loadingIndicator}):null;return(0,jsx_runtime.jsxs)(LoadingButtonRoot,(0,esm_extends.Z)({disabled:disabled||loading,id:id,ref:ref},other,{variant:variant,classes:classes,ownerState:ownerState,children:["end"===ownerState.loadingPosition?children:loadingButtonLoadingIndicator,"end"===ownerState.loadingPosition?loadingButtonLoadingIndicator:children]}))});var LoadingButton_LoadingButton=LoadingButton},11010:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return register}});var react=__webpack_require__(67294),defineProperty=__webpack_require__(59499),yup=__webpack_require__(47533),LoadingButton=__webpack_require__(31812),TextField=__webpack_require__(98271),next_link=__webpack_require__(41664),link_default=__webpack_require__.n(next_link),next_router=__webpack_require__(11163),index_esm=__webpack_require__(87536),es=__webpack_require__(74231),authContext=__webpack_require__(28423),styles_module=__webpack_require__(4712),styles_module_default=__webpack_require__.n(styles_module),jsx_runtime=__webpack_require__(85893);function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,defineProperty.Z)(target,key,source[key])}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})}return target}var features_Register=function(){(0,next_router.useRouter)();var _errors$name,_errors$email,_errors$password,_errors$confirmPasswo,schema=es.Ry().shape({name:es.Z_().required("Name is required"),email:es.Z_().email("Email is invalid").required("Email is required"),password:es.Z_().min(3,"Password must be at least 3 characters long"),confirmPassword:es.Z_().oneOf([es.iH("password"),null],"Password and confirm password does not match")}),_useForm=(0,index_esm.cI)({resolver:(0,yup.X)(schema),mode:"onChange"}),errors=_useForm.formState.errors,register=_useForm.register,handleSubmit=_useForm.handleSubmit,_useContext=(0,react.useContext)(authContext.V),signup=_useContext.signup,isLoadingAuth=_useContext.isLoadingAuth;return(0,jsx_runtime.jsx)("div",{className:styles_module_default().wrapper,children:(0,jsx_runtime.jsxs)("div",{className:styles_module_default().loginwrapper,children:[(0,jsx_runtime.jsx)("h2",{className:styles_module_default().loginTitle,children:"Welcome to Demo Classroom"}),(0,jsx_runtime.jsxs)("div",{className:styles_module_default().formWrapper,children:[(0,jsx_runtime.jsxs)("form",{onSubmit:handleSubmit(signup),className:styles_module_default().form,children:[(0,jsx_runtime.jsx)(TextField.Z,_objectSpread(_objectSpread({style:{marginBottom:20}},register("name")),{},{placeholder:"Name",label:"Name",size:"small",error:!!errors.name,helperText:null===(_errors$name=errors.name)||void 0===_errors$name?void 0:_errors$name.message})),(0,jsx_runtime.jsx)(TextField.Z,_objectSpread(_objectSpread({style:{marginBottom:20}},register("email")),{},{placeholder:"Email",label:"Email",size:"small",error:!!errors.email,helperText:null===(_errors$email=errors.email)||void 0===_errors$email?void 0:_errors$email.message})),(0,jsx_runtime.jsx)(TextField.Z,_objectSpread(_objectSpread({style:{marginBottom:20}},register("password")),{},{type:"password",placeholder:"Password",label:"Password",size:"small",error:!!errors.password,helperText:null===(_errors$password=errors.password)||void 0===_errors$password?void 0:_errors$password.message})),(0,jsx_runtime.jsx)(TextField.Z,_objectSpread(_objectSpread({style:{marginBottom:20}},register("confirmPassword")),{},{type:"password",placeholder:"Confirm password",label:"Confirm password",size:"small",error:!!errors.confirmPassword,helperText:null===(_errors$confirmPasswo=errors.confirmPassword)||void 0===_errors$confirmPasswo?void 0:_errors$confirmPasswo.message})),(0,jsx_runtime.jsx)(LoadingButton.Z,{loading:isLoadingAuth,variant:"contained",type:"submit",children:"REGISTER"})]}),(0,jsx_runtime.jsxs)("p",{children:["Already have an account?",(0,jsx_runtime.jsx)(link_default(),{href:"/login",legacyBehavior:!0,children:(0,jsx_runtime.jsx)("a",{children:(0,jsx_runtime.jsx)("b",{children:"\xa0LOGIN"})})})]})]})]})})},register=function(){return(0,jsx_runtime.jsx)(features_Register,{})}},7572:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/register",function(){return __webpack_require__(11010)}])},4712:function(module){module.exports={wrapper:"styles_wrapper__FUYwb",loginwrapper:"styles_loginwrapper__nV7To",loginTitle:"styles_loginTitle___DLrs",formWrapper:"styles_formWrapper___CG7m",form:"styles_form___D1Ra",forgotPasswordBtn:"styles_forgotPasswordBtn__XMcH4"}}},function(__webpack_require__){__webpack_require__.O(0,[271,536,491,774,888,179],function(){return __webpack_require__(__webpack_require__.s=7572)}),_N_E=__webpack_require__.O()}]);