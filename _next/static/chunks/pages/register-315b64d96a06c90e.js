(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[495],{31812:function(o,n,t){"use strict";t.d(n,{Z:function(){return x}});var r=t(63366),i=t(87462),a=t(67294),e=t(98216),s=t(27909),d=t(94780),l=t(90948),c=t(71657),g=t(83321),u=t(98456),p=t(34867),m=t(1588);function f(o){return(0,p.Z)("MuiLoadingButton",o)}let h=(0,m.Z)("MuiLoadingButton",["root","loading","loadingIndicator","loadingIndicatorCenter","loadingIndicatorStart","loadingIndicatorEnd","endIconLoadingEnd","startIconLoadingStart"]);var v=t(85893);let w=["children","disabled","id","loading","loadingIndicator","loadingPosition","variant"],P=o=>{let{loading:n,loadingPosition:t,classes:r}=o,a={root:["root",n&&"loading"],startIcon:[n&&`startIconLoading${(0,e.Z)(t)}`],endIcon:[n&&`endIconLoading${(0,e.Z)(t)}`],loadingIndicator:["loadingIndicator",n&&`loadingIndicator${(0,e.Z)(t)}`]},s=(0,d.Z)(a,f,r);return(0,i.Z)({},r,s)},b=o=>"ownerState"!==o&&"theme"!==o&&"sx"!==o&&"as"!==o&&"classes"!==o,y=(0,l.ZP)(g.Z,{shouldForwardProp:o=>b(o)||"classes"===o,name:"MuiLoadingButton",slot:"Root",overridesResolver:(o,n)=>[n.root,n.startIconLoadingStart&&{[`& .${h.startIconLoadingStart}`]:n.startIconLoadingStart},n.endIconLoadingEnd&&{[`& .${h.endIconLoadingEnd}`]:n.endIconLoadingEnd}]})(({ownerState:o,theme:n})=>(0,i.Z)({[`& .${h.startIconLoadingStart}, & .${h.endIconLoadingEnd}`]:{transition:n.transitions.create(["opacity"],{duration:n.transitions.duration.short}),opacity:0}},"center"===o.loadingPosition&&{transition:n.transitions.create(["background-color","box-shadow","border-color"],{duration:n.transitions.duration.short}),[`&.${h.loading}`]:{color:"transparent"}},"start"===o.loadingPosition&&o.fullWidth&&{[`& .${h.startIconLoadingStart}, & .${h.endIconLoadingEnd}`]:{transition:n.transitions.create(["opacity"],{duration:n.transitions.duration.short}),opacity:0,marginRight:-8}},"end"===o.loadingPosition&&o.fullWidth&&{[`& .${h.startIconLoadingStart}, & .${h.endIconLoadingEnd}`]:{transition:n.transitions.create(["opacity"],{duration:n.transitions.duration.short}),opacity:0,marginLeft:-8}})),_=(0,l.ZP)("div",{name:"MuiLoadingButton",slot:"LoadingIndicator",overridesResolver(o,n){let{ownerState:t}=o;return[n.loadingIndicator,n[`loadingIndicator${(0,e.Z)(t.loadingPosition)}`]]}})(({theme:o,ownerState:n})=>(0,i.Z)({position:"absolute",visibility:"visible",display:"flex"},"start"===n.loadingPosition&&("outlined"===n.variant||"contained"===n.variant)&&{left:"small"===n.size?10:14},"start"===n.loadingPosition&&"text"===n.variant&&{left:6},"center"===n.loadingPosition&&{left:"50%",transform:"translate(-50%)",color:(o.vars||o).palette.action.disabled},"end"===n.loadingPosition&&("outlined"===n.variant||"contained"===n.variant)&&{right:"small"===n.size?10:14},"end"===n.loadingPosition&&"text"===n.variant&&{right:6},"start"===n.loadingPosition&&n.fullWidth&&{position:"relative",left:-10},"end"===n.loadingPosition&&n.fullWidth&&{position:"relative",right:-10})),I=a.forwardRef(function(o,n){let t=(0,c.Z)({props:o,name:"MuiLoadingButton"}),{children:a,disabled:e=!1,id:d,loading:l=!1,loadingIndicator:g,loadingPosition:p="center",variant:m="text"}=t,f=(0,r.Z)(t,w),h=(0,s.Z)(d),b=null!=g?g:(0,v.jsx)(u.Z,{"aria-labelledby":h,color:"inherit",size:16}),I=(0,i.Z)({},t,{disabled:e,loading:l,loadingIndicator:b,loadingPosition:p,variant:m}),x=P(I),Z=l?(0,v.jsx)(_,{className:x.loadingIndicator,ownerState:I,children:b}):null;return(0,v.jsxs)(y,(0,i.Z)({disabled:e||l,id:h,ref:n},f,{variant:m,classes:x,ownerState:I,children:["end"===I.loadingPosition?a:Z,"end"===I.loadingPosition?Z:a]}))});var x=I},76255:function(o,n,t){"use strict";t.r(n),t.d(n,{default:function(){return b}});var r=t(67294),i=t(59499),a=t(47533),e=t(31812),s=t(98271),d=t(41664),l=t.n(d),c=t(11163),g=t(87536),u=t(74231),p=t(7456),m=t(15086),f=t.n(m),h=t(85893);function v(o,n){var t=Object.keys(o);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(o);n&&(r=r.filter(function(n){return Object.getOwnPropertyDescriptor(o,n).enumerable})),t.push.apply(t,r)}return t}function w(o){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?v(Object(t),!0).forEach(function(n){(0,i.Z)(o,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(o,Object.getOwnPropertyDescriptors(t)):v(Object(t)).forEach(function(n){Object.defineProperty(o,n,Object.getOwnPropertyDescriptor(t,n))})}return o}var P=function(){(0,c.useRouter)();var o,n,t,i,d=u.Ry().shape({name:u.Z_().required("Name is required"),email:u.Z_().email("Email is invalid").required("Email is required"),password:u.Z_().min(3,"Password must be at least 3 characters long"),confirmPassword:u.Z_().oneOf([u.iH("password"),null],"Password and confirm password does not match")}),m=(0,g.cI)({resolver:(0,a.X)(d),mode:"onChange"}),v=m.formState.errors,P=m.register,b=m.handleSubmit,y=(0,r.useContext)(p.V),_=y.signup,I=y.isLoadingAuth;return(0,h.jsx)("div",{className:f().wrapper,children:(0,h.jsxs)("div",{className:f().loginwrapper,children:[(0,h.jsx)("h2",{className:f().loginTitle,children:"Welcome to Demo Classroom"}),(0,h.jsxs)("div",{className:f().formWrapper,children:[(0,h.jsxs)("form",{onSubmit:b(_),className:f().form,children:[(0,h.jsx)(s.Z,w(w({style:{marginBottom:20}},P("name")),{},{placeholder:"Name",label:"Name",size:"small",error:!!v.name,helperText:null===(o=v.name)||void 0===o?void 0:o.message})),(0,h.jsx)(s.Z,w(w({style:{marginBottom:20}},P("email")),{},{placeholder:"Email",label:"Email",size:"small",error:!!v.email,helperText:null===(n=v.email)||void 0===n?void 0:n.message})),(0,h.jsx)(s.Z,w(w({style:{marginBottom:20}},P("password")),{},{type:"password",placeholder:"Password",label:"Password",size:"small",error:!!v.password,helperText:null===(t=v.password)||void 0===t?void 0:t.message})),(0,h.jsx)(s.Z,w(w({style:{marginBottom:20}},P("confirmPassword")),{},{type:"password",placeholder:"Confirm password",label:"Confirm password",size:"small",error:!!v.confirmPassword,helperText:null===(i=v.confirmPassword)||void 0===i?void 0:i.message})),(0,h.jsx)(e.Z,{loading:I,variant:"contained",type:"submit",children:"REGISTER"})]}),(0,h.jsxs)("p",{children:["Already have an account?",(0,h.jsx)(l(),{href:"/login",legacyBehavior:!0,children:(0,h.jsx)("a",{children:(0,h.jsx)("b",{children:"\xa0LOGIN"})})})]})]})]})})},b=function(){return(0,h.jsx)(P,{})}},7572:function(o,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/register",function(){return t(76255)}])},15086:function(o){o.exports={wrapper:"styles_wrapper__I_xYr",loginwrapper:"styles_loginwrapper__Ad0nM",loginTitle:"styles_loginTitle__cgL24",formWrapper:"styles_formWrapper__WEndo",form:"styles_form__z_P3h",forgotPasswordBtn:"styles_forgotPasswordBtn__1Racp"}}},function(o){o.O(0,[271,536,491,774,888,179],function(){return o(o.s=7572)}),_N_E=o.O()}]);