(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[277],{4736:function(__unused_webpack_module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.Z=void 0;var _createSvgIcon=_interopRequireDefault(__webpack_require__(64938)),_jsxRuntime=__webpack_require__(85893),_default=(0,_createSvgIcon.default)((0,_jsxRuntime.jsx)("path",{d:"M3 3v18h18V3H3zm14 12.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"}),"DisabledByDefault");exports.Z=_default},9869:function(__unused_webpack_module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.Z=void 0;var _createSvgIcon=_interopRequireDefault(__webpack_require__(64938)),_jsxRuntime=__webpack_require__(85893),_default=(0,_createSvgIcon.default)((0,_jsxRuntime.jsx)("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"}),"ModeEdit");exports.Z=_default},66818:function(__unused_webpack_module,exports,__webpack_require__){"use strict";var _interopRequireDefault=__webpack_require__(64836);exports.Z=void 0;var _createSvgIcon=_interopRequireDefault(__webpack_require__(64938)),_jsxRuntime=__webpack_require__(85893),_default=(0,_createSvgIcon.default)((0,_jsxRuntime.jsx)("path",{d:"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"}),"Save");exports.Z=_default},87357:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return Box_Box}});var esm_extends=__webpack_require__(87462),objectWithoutPropertiesLoose=__webpack_require__(63366),react=__webpack_require__(67294),clsx_m=__webpack_require__(86010),styled_engine=__webpack_require__(49731),styleFunctionSx=__webpack_require__(86523),extendSxProp=__webpack_require__(39707),useTheme=__webpack_require__(96682),jsx_runtime=__webpack_require__(85893);let _excluded=["className","component"];var ClassNameGenerator=__webpack_require__(37078),createTheme=__webpack_require__(21265);let defaultTheme=(0,createTheme.Z)(),Box=function(options={}){let{defaultTheme,defaultClassName="MuiBox-root",generateClassName}=options,BoxRoot=(0,styled_engine.ZP)("div",{shouldForwardProp:prop=>"theme"!==prop&&"sx"!==prop&&"as"!==prop})(styleFunctionSx.Z),Box=react.forwardRef(function(inProps,ref){let theme=(0,useTheme.Z)(defaultTheme),_extendSxProp=(0,extendSxProp.Z)(inProps),{className,component="div"}=_extendSxProp,other=(0,objectWithoutPropertiesLoose.Z)(_extendSxProp,_excluded);return(0,jsx_runtime.jsx)(BoxRoot,(0,esm_extends.Z)({as:component,ref:ref,className:(0,clsx_m.Z)(className,generateClassName?generateClassName(defaultClassName):defaultClassName),theme:theme},other))});return Box}({defaultTheme,defaultClassName:"MuiBox-root",generateClassName:ClassNameGenerator.Z.generate});var Box_Box=Box},39707:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,{Z:function(){return extendSxProp}});var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(87462),_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(63366),_mui_utils__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(59766),_defaultSxConfig__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(44920);let _excluded=["sx"],splitProps=props=>{var _props$theme$unstable,_props$theme;let result={systemProps:{},otherProps:{}},config=null!=(_props$theme$unstable=null==props?void 0:null==(_props$theme=props.theme)?void 0:_props$theme.unstable_sxConfig)?_props$theme$unstable:_defaultSxConfig__WEBPACK_IMPORTED_MODULE_0__.Z;return Object.keys(props).forEach(prop=>{config[prop]?result.systemProps[prop]=props[prop]:result.otherProps[prop]=props[prop]}),result};function extendSxProp(props){let finalSx;let{sx:inSx}=props,other=(0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__.Z)(props,_excluded),{systemProps,otherProps}=splitProps(other);return finalSx=Array.isArray(inSx)?[systemProps,...inSx]:"function"==typeof inSx?(...args)=>{let result=inSx(...args);return(0,_mui_utils__WEBPACK_IMPORTED_MODULE_2__.P)(result)?(0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__.Z)({},systemProps,result):systemProps}:(0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__.Z)({},systemProps,inSx),(0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_3__.Z)({},otherProps,{sx:finalSx})}},52676:function(__unused_webpack_module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:function(){return profile}});var react=__webpack_require__(67294),LoadingScreen=__webpack_require__(84002),defineProperty=__webpack_require__(59499),asyncToGenerator=__webpack_require__(50029),regenerator=__webpack_require__(87794),regenerator_default=__webpack_require__.n(regenerator),yup=__webpack_require__(47533),DisabledByDefault=__webpack_require__(4736),ModeEdit=__webpack_require__(9869),Save=__webpack_require__(66818),Avatar=__webpack_require__(69661),TextField=__webpack_require__(98271),Button=__webpack_require__(83321),Box=__webpack_require__(87357),index_esm=__webpack_require__(87536),es=__webpack_require__(74231),client_user=__webpack_require__(62304),utils=__webpack_require__(62582),styles_module=__webpack_require__(77882),styles_module_default=__webpack_require__.n(styles_module),jsx_runtime=__webpack_require__(85893);function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){(0,defineProperty.Z)(target,key,source[key])}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})}return target}var components_UserProfile=function(_ref){var _ref2,user=_ref.user,_useState=(0,react.useState)(!1),updateMode=_useState[0],setUpdateMode=_useState[1],_useState2=(0,react.useState)((null==user?void 0:user.name)||"default-name"),name=_useState2[0];_useState2[1];var schema=es.Ry({password:es.Z_().required("Password is required"),newPassword:es.Z_().required("New password is required"),confirmedNewPassword:es.Z_().oneOf([es.iH("newPassword"),null],"Password and confirm password does not match")}).required(),_useForm=(0,index_esm.cI)({resolver:(0,yup.X)(schema)}),errors=_useForm.formState.errors,control=_useForm.control,handleSubmit=_useForm.handleSubmit,handleUpdateUserInfo=(_ref2=(0,asyncToGenerator.Z)(regenerator_default().mark(function _callee(data){var formData,res;return regenerator_default().wrap(function(_context){for(;;)switch(_context.prev=_context.next){case 0:if(updateMode){_context.next=4;break}setUpdateMode(!0),_context.next=24;break;case 4:return formData={name:data.name,password:data.password,newPassword:data.newPassword},_context.prev=5,_context.next=8,(0,client_user.gS)(formData);case 8:if("OK"!==(res=_context.sent).status){_context.next=14;break}return _context.next=12,(0,utils.Xr)("Update information successfully!");case 12:_context.next=16;break;case 14:return _context.next=16,(0,utils.Xr)("ERROR",res.message);case 16:setUpdateMode(!1),_context.next=24;break;case 19:return _context.prev=19,_context.t0=_context.catch(5),_context.next=23,(0,utils.Xr)("ERROR",_context.t0.response.data.message);case 23:setUpdateMode(!1);case 24:case"end":return _context.stop()}},_callee,null,[[5,19]])})),function(_x){return _ref2.apply(this,arguments)}),handleChangeMode=function(mode){setUpdateMode(mode)};return(0,jsx_runtime.jsx)("div",{className:styles_module_default().wapper,children:(0,jsx_runtime.jsxs)("div",{className:styles_module_default().profile,children:[(0,jsx_runtime.jsx)(Avatar.Z,{className:styles_module_default().avatar,children:null==user?void 0:user.name[0]}),(0,jsx_runtime.jsxs)(Box.Z,{className:styles_module_default().info,component:"form",noValidate:!0,autoComplete:"off",onSubmit:handleSubmit(function(data){return handleUpdateUserInfo(data)}),children:[(0,jsx_runtime.jsxs)(Box.Z,{children:[(0,jsx_runtime.jsx)(index_esm.Qr,{name:"name",defaultValue:name,control:control,render:function(_ref3){var field=_ref3.field;return(0,jsx_runtime.jsx)(TextField.Z,_objectSpread({className:styles_module_default().infoField,label:"Name",variant:"outlined",type:"name",disabled:!updateMode,style:{display:"inline-flex"}},field))}}),(0,jsx_runtime.jsx)(TextField.Z,{className:styles_module_default().infoField,id:"email",label:"Email",variant:"outlined",value:null==user?void 0:user.email,disabled:!0}),(0,jsx_runtime.jsx)(index_esm.Qr,{name:"password",defaultValue:"",control:control,render:function(_ref4){var _errors$password,field=_ref4.field;return(0,jsx_runtime.jsx)(TextField.Z,_objectSpread({error:!!(null!=errors&&errors.password),helperText:null==errors?void 0:null===(_errors$password=errors.password)||void 0===_errors$password?void 0:_errors$password.message,className:styles_module_default().infoField,label:"Current password",variant:"outlined",type:"password",autoComplete:"current-password",disabled:!updateMode,style:updateMode?{display:"inline-flex",width:"100%"}:{display:"none"}},field))}}),(0,jsx_runtime.jsx)(index_esm.Qr,{name:"newPassword",defaultValue:"",control:control,render:function(_ref5){var _errors$newPassword,field=_ref5.field;return(0,jsx_runtime.jsx)(TextField.Z,_objectSpread({className:styles_module_default().infoField,error:!!(null!=errors&&errors.newPassword),helperText:null==errors?void 0:null===(_errors$newPassword=errors.newPassword)||void 0===_errors$newPassword?void 0:_errors$newPassword.message,label:"New password",variant:"outlined",type:"password",autoComplete:"new-password",disabled:!updateMode,style:updateMode?{display:"inline-flex",width:"100%"}:{display:"none"}},field))}}),(0,jsx_runtime.jsx)(index_esm.Qr,{name:"confirmedNewPassword",defaultValue:"",control:control,render:function(_ref6){var _errors$confirmedNewP,field=_ref6.field;return(0,jsx_runtime.jsx)(TextField.Z,_objectSpread({className:styles_module_default().infoField,error:!!(null!=errors&&errors.confirmedNewPassword),helperText:null==errors?void 0:null===(_errors$confirmedNewP=errors.confirmedNewPassword)||void 0===_errors$confirmedNewP?void 0:_errors$confirmedNewP.message,label:"Confirm new password",variant:"outlined",type:"password",autoComplete:"confirm-new-password",disabled:!updateMode,style:updateMode?{display:"inline-flex",width:"100%"}:{display:"none"}},field))}})]}),(0,jsx_runtime.jsxs)(Box.Z,{sx:{width:"100%",textAlign:"center"},children:[!updateMode&&(0,jsx_runtime.jsxs)(Button.Z,{variant:"contained",className:"btnPrimary custom-button",type:"button",sx:{marginRight:"20px"},onClick:function(){handleChangeMode(!0)},children:[(0,jsx_runtime.jsx)(ModeEdit.Z,{}),"\xa0Edit"]}),updateMode&&(0,jsx_runtime.jsxs)(Button.Z,{variant:"contained",className:"btnPrimary custom-button",type:"submit",sx:{marginRight:"20px"},children:[(0,jsx_runtime.jsx)(Save.Z,{}),"\xa0Save"]}),updateMode&&(0,jsx_runtime.jsxs)(Button.Z,{variant:"contained",className:"btnLightPrimiary custom-button",type:"button",onClick:function(){handleChangeMode(!1)},children:[(0,jsx_runtime.jsx)(DisabledByDefault.Z,{}),"\xa0Cancel"]})]})]})]})})},authContext=__webpack_require__(28423),profile=function(){var _useContext=(0,react.useContext)(authContext.V),user=_useContext.user,isLoadingAuth=_useContext.isLoadingAuth;return _useContext.isAuthenticated||(window.location.href="/login"),!user||isLoadingAuth?(0,jsx_runtime.jsx)(LoadingScreen.Z,{}):(0,jsx_runtime.jsx)(components_UserProfile,{user:user})}},19344:function(__unused_webpack_module,__unused_webpack_exports,__webpack_require__){(window.__NEXT_P=window.__NEXT_P||[]).push(["/profile",function(){return __webpack_require__(52676)}])},77882:function(module){module.exports={wapper:"styles_wapper__g_WTt",profile:"styles_profile__b3FXn",avatar:"styles_avatar__koD2I",info:"styles_info__JffqU",infoField:"styles_infoField__hs8xR",contributedList:"styles_contributedList__mNzga"}}},function(__webpack_require__){__webpack_require__.O(0,[271,536,491,774,888,179],function(){return __webpack_require__(__webpack_require__.s=19344)}),_N_E=__webpack_require__.O()}]);