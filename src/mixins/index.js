export const mixin = {
    methods: {
        //    获取性别
        changeGender(value) {
            if (value == 1) {
                return '男'
            }
            if (value == 2) {
                return '女'
            }
            if (value == 3) {
                return '组合'
            }
        },
        //    更改生日类型
        changeBirth(value) {
            return String(value).substr(0, 10);
        },

        //    获取歌单风格
        changeStyle2(value) {
            if (value == 1) {
                return '流行'
            }
            if (value == 2) {
                return '经典'
            }
            if (value == 3) {
                return '欧美'
            }
        },


    }

}