(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[731],{60232:function(n,t,r){"use strict";var l=r(41664),o=r.n(l);r(67294);var s=r(67855),i=r.n(s),a=r(85893),c=function(n){var t=n.paths;return(0,a.jsx)("div",{className:i().breadcrumb,children:t.map(function(n,t){return(0,a.jsx)(o(),{href:n.href,legacyBehavior:!0,children:(0,a.jsx)("a",{children:t?(0,a.jsxs)(a.Fragment,{children:["\xbb ",n.label,"\xa0\xa0"]}):(0,a.jsxs)(a.Fragment,{children:[n.label,"\xa0\xa0"]})})},t)})})};t.Z=c},69169:function(n,t,r){"use strict";r.r(t),r.d(t,{default:function(){return q}});var l=r(59499),o=r(27812),s=r(50029),i=r(87794),a=r.n(i),c=r(41733),d=r(41715),u=r(86886),p=r(83321),x=r(99332),v=r(93946),h=r(98271),_=r(50657),f=r(31425),b=r(6514),m=r(37645),j=r(90629),w=r(7906),Z=r(295),y=r(53252),g=r(72882),O=r(53184),R=r(68509),C=r(11163),k=r(67294),E=r(87536),S=r(44644),P=r(65265),I=r(60232),N=r(79013),W=r(49214),X=r(713),D=r(69198),A=r.n(D),L=r(85893);function V(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(n);t&&(l=l.filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable})),r.push.apply(r,l)}return r}function B(n){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?V(Object(r),!0).forEach(function(t){(0,l.Z)(n,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):V(Object(r)).forEach(function(t){Object.defineProperty(n,t,Object.getOwnPropertyDescriptor(r,t))})}return n}function q(){var n,t,r,l,i,D,V=(0,k.useState)(null),q=V[0],H=V[1],K=(0,C.useRouter)(),U=(0,k.useState)(!1),T=U[0],z=U[1],F=(0,k.useContext)(W.V),G=F.user,Y=F.isLoadingAuth,M=(0,k.useState)(!0),J=M[0],Q=M[1],$=(0,E.cI)({mode:"onChange"}),ee=$.register,en=$.handleSubmit,et=(0,k.useState)(!1),er=et[0],el=et[1],eo=(l=(0,s.Z)(a().mark(function n(t){var r,l,o;return a().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,(0,S.OV)({collaboratorEmail:t.collaboratorEmail,presentationId:q._id,userId:q.ownerId});case 3:if((null==(r=n.sent)?void 0:r.status)!=="OK"){n.next=9;break}return n.next=7,(0,X.Xr)("SUCCESS","Add collaborator successfully!");case 7:el(!1),K.reload();case 9:n.next=15;break;case 11:return n.prev=11,n.t0=n.catch(0),n.next=15,(0,X.Xr)("ERROR",null===n.t0||void 0===n.t0?void 0:null===(l=n.t0.response)||void 0===l?void 0:null===(o=l.data)||void 0===o?void 0:o.message);case 15:case"end":return n.stop()}},n,null,[[0,11]])})),function(n){return l.apply(this,arguments)}),es=(i=(0,s.Z)(a().mark(function n(){var t,r,l,s,i,c;return a().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,(0,S.FE)(K.query.id);case 3:if("OK"!==(t=n.sent).status){n.next=17;break}return(null===(r=s=t.data[0])||void 0===r?void 0:r.ownerId)!==(null==G?void 0:G._id)&&K.back(),n.next=9,(0,P.h9)([s.ownerId].concat((0,o.Z)(s.collaborators)));case 9:i=n.sent,c={},null==i||null===(l=i.data)||void 0===l||l.forEach(function(n){return c[null==n?void 0:n._id]=n}),s.collaborators=s.collaborators.map(function(n){return c[n]}),s=B(B({},s),{},{owner:c[s.ownerId]}),H(s),n.next=20;break;case 17:return n.next=19,(0,X.Xr)("ERROR","Presentation not found!");case 19:K.push("/presentation");case 20:n.next=26;break;case 22:n.prev=22,n.t0=n.catch(0),K.push("/presentation"),Q(!1);case 26:Q(!1);case 27:case"end":return n.stop()}},n,null,[[0,22]])})),function(){return i.apply(this,arguments)});(0,k.useEffect)(function(){es()},[]);var ei,ea=(D=(0,s.Z)(a().mark(function n(t){var r,l,o,s,i,c;return a().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,r={userId:null==q?void 0:q.ownerId,presentationId:null==q?void 0:q._id,collaboratorId:null==t?void 0:t._id},n.next=4,(0,S.wW)(r);case 4:if((null==(l=n.sent)?void 0:l.status)!=="OK"){n.next=11;break}return n.next=8,(0,X.Xr)("SUCCESS","Remove collaborator ".concat(t.name," successfully!"));case 8:K.reload(),n.next=13;break;case 11:return n.next=13,(0,X.Xr)("ERROR",null===(o=e.response)||void 0===o?void 0:null===(s=o.data)||void 0===s?void 0:s.message);case 13:n.next=19;break;case 15:return n.prev=15,n.t0=n.catch(0),n.next=19,(0,X.Xr)("ERROR",null===(i=n.t0.response)||void 0===i?void 0:null===(c=i.data)||void 0===c?void 0:c.message);case 19:case"end":return n.stop()}},n,null,[[0,15]])})),function(n){return D.apply(this,arguments)}),ec=(ei=(0,s.Z)(a().mark(function n(){var t,r,l,o,s,i;return a().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,t=K.query.id,n.next=4,(0,S.Pg)(t);case 4:if((null==(r=n.sent)?void 0:r.status)!=="OK"){n.next=11;break}return n.next=8,(0,X.Xr)("SUCCESS","Remove presentation ".concat(q.name," successfully!"));case 8:window.location.href="/presentation",n.next=13;break;case 11:return n.next=13,(0,X.Xr)("ERROR",null===(l=e.response)||void 0===l?void 0:null===(o=l.data)||void 0===o?void 0:o.message);case 13:n.next=19;break;case 15:return n.prev=15,n.t0=n.catch(0),n.next=19,(0,X.Xr)("ERROR",null===(s=n.t0.response)||void 0===s?void 0:null===(i=s.data)||void 0===i?void 0:i.message);case 19:case"end":return n.stop()}},n,null,[[0,15]])})),function(){return ei.apply(this,arguments)});return J||Y||!G?(0,L.jsx)(N.Z,{}):(0,L.jsxs)(u.ZP,{container:!0,spacing:6,className:A().wrapper,children:[(0,L.jsx)(I.Z,{paths:[{label:"Home",href:"/"},{label:"Presentation",href:"/presentation"},{label:null==q?void 0:q.name,href:"/presentation/".concat(null==q?void 0:q._id)}]}),(0,L.jsxs)(u.ZP,{item:!0,xs:12,style:{display:"flex",justifyContent:"flex-end"},children:[(0,L.jsx)(p.Z,{className:"custom-button",variant:"contained",onClick:function(){return el(!0)},startIcon:(0,L.jsx)(d.Z,{}),children:"Add a collaborator"}),(0,L.jsx)(p.Z,{sx:{marginLeft:"15px"},variant:"outlined",color:"error",onClick:function(){return z(!0)},startIcon:(0,L.jsx)(c.Z,{}),children:"Delete"})]}),(0,L.jsx)(u.ZP,{item:!0,xs:12,children:(0,L.jsx)("h1",{style:{textAlign:"center"},children:null==q?void 0:q.name})}),(0,L.jsx)(u.ZP,{item:!0,xs:12,children:(0,L.jsx)(g.Z,{component:j.Z,children:(0,L.jsxs)(w.Z,{sx:{minWidth:650},"aria-label":"simple table",children:[(0,L.jsx)(O.Z,{className:A().tableHead,children:(0,L.jsxs)(R.Z,{children:[(0,L.jsx)(y.Z,{align:"center",children:"Name"}),(0,L.jsx)(y.Z,{align:"center",children:"Email"}),(0,L.jsx)(y.Z,{align:"center",children:"Role"}),(null==G?void 0:G._id)===(null==q?void 0:q.ownerId)&&(0,L.jsx)(y.Z,{align:"center",children:"Action"})]})}),(0,L.jsxs)(Z.Z,{children:[(0,L.jsxs)(R.Z,{className:A().ownerRow,children:[(0,L.jsx)(y.Z,{align:"center",children:null==q?void 0:null===(n=q.owner)||void 0===n?void 0:n.name}),(0,L.jsx)(y.Z,{align:"center",children:null==q?void 0:null===(t=q.owner)||void 0===t?void 0:t.email}),(0,L.jsx)(y.Z,{align:"center",children:"OWNER"}),(0,L.jsx)(y.Z,{align:"center",children:(0,L.jsx)(x.Z,{title:"Add new collaborator",children:(0,L.jsx)(v.Z,{onClick:function(){return el(!0)},children:(0,L.jsx)(d.Z,{})})})})]},null==q?void 0:q.ownerId),null==q?void 0:null===(r=q.collaborators)||void 0===r?void 0:r.map(function(n){return(0,L.jsxs)(R.Z,{className:A().memberRow,children:[(0,L.jsx)(y.Z,{align:"center",children:null==n?void 0:n.name}),(0,L.jsx)(y.Z,{align:"center",children:null==n?void 0:n.email}),(0,L.jsx)(y.Z,{align:"center",children:"COLLABORATOR"}),(0,L.jsx)(y.Z,{align:"center",children:(null==G?void 0:G._id)===(null==q?void 0:q.ownerId)&&(0,L.jsx)(x.Z,{title:"Remove collaborator",children:(0,L.jsx)(v.Z,{color:"error",onClick:function(){return ea(n)},children:(0,L.jsx)(c.Z,{})})})})]},null==n?void 0:n._id)})]})]})})}),(0,L.jsx)(_.Z,{open:er,onClose:function(){return el(!1)},style:{width:"100%"},children:(0,L.jsxs)("form",{onSubmit:en(eo),children:[(0,L.jsx)(m.Z,{id:"alert-dialog-title",children:"Invite a collaborator by email"}),(0,L.jsx)(b.Z,{style:{overflowY:"initial"},children:(0,L.jsx)(h.Z,B(B({label:"Collaborator's email",placeholder:"Enter collaborator's email"},ee("collaboratorEmail")),{},{type:"email",required:!0,fullWidth:!0}))}),(0,L.jsxs)(f.Z,{children:[(0,L.jsx)(p.Z,{className:"custom-button-outlined",variant:"outlined",onClick:function(){return el(!1)},children:"Cancel"}),(0,L.jsx)(p.Z,{className:"custom-button",variant:"contained",type:"submit",children:"Add"})]})]})}),(0,L.jsxs)(_.Z,{open:T,onClose:function(){return z(!1)},children:[(0,L.jsx)(m.Z,{id:"alert-dialog-title",children:"Please confirm to delete this presentation"}),(0,L.jsxs)(f.Z,{children:[(0,L.jsx)(p.Z,{className:"custom-button-outlined",variant:"outlined",onClick:function(){return z(!1)},children:"Cancel"}),(0,L.jsx)(p.Z,{color:"error",variant:"contained",onClick:ec,children:"Delete"})]})]})]})}},55291:function(n,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/presentation/[id]/collaboration",function(){return r(69169)}])},67855:function(n){n.exports={breadcrumb:"styles_breadcrumb__xKCmg"}},69198:function(n){n.exports={slide:"styles_slide__8Vk_a",previewSlide:"styles_previewSlide__7N5xg",buttonGroup:"styles_buttonGroup__etxno",zoomButton:"styles_zoomButton__XSPF1",wrapper:"styles_wrapper__WmLww",ownerRow:"styles_ownerRow__U6fSM",coOwnerRow:"styles_coOwnerRow__9yaq_",memberRow:"styles_memberRow__ObfCW",slidesList:"styles_slidesList__D7qtc",slideItem:"styles_slideItem__EjV_1",index:"styles_index__pC0aU",previewSlideItem:"styles_previewSlideItem__RUuWq",deleteButton:"styles_deleteButton__WNEbY",selected:"styles_selected__HDi3C",presentationSlideCol:"styles_presentationSlideCol__DLZIN",previewPresentationSlideCol:"styles_previewPresentationSlideCol__1HEuh",buttonWrapper:"styles_buttonWrapper__rL3zE",previewTitle:"styles_previewTitle__dxxh6",userVoteViewWrapper:"styles_userVoteViewWrapper__PKBC8",fullWidth:"styles_fullWidth__ozRP2",tableHead:"styles_tableHead__DOBRV"}}},function(n){n.O(0,[271,536,645,886,562,228,774,888,179],function(){return n(n.s=55291)}),_N_E=n.O()}]);