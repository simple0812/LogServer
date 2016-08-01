 var validator = (function() {
     return {
         className: 'validator',
         compareMode: {
             lt: function(org, target) {
                 return org < target;
             },
             eq: function(org, target) {
                 return org === target;
             },
             gt: function(org, target) {
                 return org > target;
             },
             le: function(org, target) {
                 return org <= target;
             },
             ge: function(org, target) {
                 return org >= target;
             },
             ne: function(org, target) {
                 return org !== target;
             }
         },
         actions: {
             email: {
                 reg: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                 err: '格式不正确'
             },
             phone: {
                 reg: /^(1(([358][0-9])|(47)|[8][01236789]))\d{8}$/,
                 err: '格式不正确'
             },
             tel: {
                 reg: /^(\+?\d{1,3})?\s*(0\d{2,3}(\-)?)?\d{7,8}$/,
                 err: '格式不正确'
             },
             specialChar: {
                 reg: /^[a-zA-Z0-9_\(\)\-\u4e00-\u9fa5《》,，]+$/,
                 err: '格式不正确, 只能为字母、数字、汉字、下划线、《、》等'
             },
             "!htmlChar": {
                 reg: /[<>]+/,
                 err: '含有特殊字符'
             },
             password: {
                 reg: /^.{4,18}$/,
                 err: '长度必须为4到18个字符'
             },
             housePhone: {
                 reg: /\d{1,6}/,
                 err: '格式不正确, 只能为6位以内的数字'
             },
             bookingDate: {
                 reg: /^((0?\d)|(1\d)|(2[0-3])):([0-5]\d)$/,
                 err: '格式不正确, 时间格式为00:00'
             },
             "Number": {
                 reg: /^\d+(\.\d+)?$/,
                 err: '格式不正确, 必须为数字'
             },
             strLen: {
                 reg: /^[^\<\>]{1,30}$/,
                 err: '长度必须小于30个字符'
             }
         },

         validate: function(obj) {
             var p = $(obj).attr(this.className) || '';
             var des = $(obj).attr('description') || '';

             var txt = arguments[1] || $(obj).val() || $(obj).html();

             var isRequired = $(obj).get(0).hasAttribute('required') || $(obj).get(0).hasAttribute('xrequired'); //是否必须
             var isCompare = $(obj).attr('compare'); //是否比较

             if (txt.trim().length === 0) {
                 if (isRequired) {
                     common.popBy(obj, des + "不能为空");
                     return false;
                 }

                 if (isCompare && !this.compare(obj, isCompare.split('|')[0], isCompare.split('|')[1])) {
                     common.popBy(obj, des + "输入不匹配");
                     return false;
                 }

                 return true;
             }


             if (p.length === 0) return true;

             var action = this.actions[p];

             if (action == null) {
                 //common.popBy(obj, '对应的正则表达式不存在');
                 return true;
             }

             if (action.reg.constructor !== RegExp) action.reg = new RegExp(action.reg);

             //如果验证的类型是以!开头的 则表示相反的情况
             if (p.indexOf('!') == 0) {
                 if (action.reg.test(txt)) {
                     common.popBy(obj, des + action.err);
                     return false;
                 }
             } else {
                 if (!action.reg.test(txt)) {
                     common.popBy(obj, des + action.err);
                     return false;
                 }
             }



             if (isCompare && !this.compare(obj, isCompare.split('|')[0], isCompare.split('|')[1])) {
                 common.popBy(obj, des + "输入不匹配");
                 return false;
             }

             return true;

         },
         /*mode: lt*/
         compare: function(obj, target, mode) {
             if ($(obj).length == 0 || $(target).length == 0) return false;

             mode = mode || 'eq';

             var objVal = $(obj).val() || $(obj).html();
             var targetVal = $(target).val() || $(target).html();
             return this.compareMode[mode](objVal, targetVal);
         },

         bind: function(parent) {
             var obj = parent ? $(parent).find('.validator') : $('.validator');
             var _this = this;
             obj.blur(function() {
                 _this.validate(this)
             })
         },

         delegate: function(parent) {
             var _this = this;
             $(parent).delegate('.validator', 'blur', function() {
                 _this.validate(this);
             })
         },

         validateAll: function(parent) {
             var _this = this;
             var ret = 0;
             var obj = parent ? $(parent).find('.validator') : $('.validator');

             obj.each(function(i, o) {
                 if (!_this.validate(o)) ret++;
             });

             return ret === 0;
         }
     };

 })();

 if (typeof define === "function" && define.amd) {
     define(['common'], function() {
         return validator;
     });
 }