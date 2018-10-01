/*
一、组件名称
	分页基组件，需继承 extends: Rabbit.Vue.PagingBC
二、用法
	1、组件属性 dataList, pageNum, showPageBtn, currentPage
		+ dataList
			* 说明		需要分页的数据
			* 类型		Array
			* 是否必须	true
			* 使用		在组件标签中 :data-list="..."

		+ pageNum
			* 说明		每页展示的数据量
			* 类型 		Number
			* 默认值		10
			* 是否必须	false
			* 使用		在组件标签中 :page-num="..."

		+ showPageBtn
			* 说明		分页上展示，数字的按钮数量
			* 类型 		Number
			* 默认值		5
			* 是否必须	false
			* 使用		在组件标签中 :show-page-btn="..."
		
		+ currentPage
			* 说明		当前分页后，选中的页码
			* 类型 		Number
			* 默认值		1
			* 是否必须	false
			* 使用		在组件标签中 :current-page="..."

	2、缓存变量，即就是computed。 
		+ pageTextList
			* 说明		页码上的文本，及按钮的样式
			* 类型 		Array
			* 值		    [{'text': 1, 'isSeleted': true|false,}, ...]

		+ totalPage
			* 说明		数据总量
			* 类型 		Number		

		+ showDataList
			* 说明		当前页展示的数据
			* 类型 		Array
	
	3、方法 
		+ toPageData
			* 说明		按钮动作事件
			* 类型		function
			* 参数		toPageData(num)
							- num 	
								* 说明	跳转的页码
								* 类型	Number | String
								* 值：    0   表示 上一页页码
										-1    表示 下一页页码
										非0   正整数 表示页码
										...   表示 省略的页码
	4、监听
		+ pageNum
			* 说明		当切换每页展示数量时，如果当前页码不为1，那么当前页码变更为1
 */				
(function (window, undefined) {
	var PagingBC = {
		props: {
			// 要解析的数据
			dataList: {
				type: Array,
				require: true,
			},
			// 每页默认展示的数量
			pageNum: {
				type: Number,
				default: 10,
			},
			// 有数字的按钮，最多展示的数量
			showPageBtn: {
				type: Number,
				default: 5,
				validator: function (val) {
					return val%2 == 1;
				},
			},
			currentPage: {
				type: Number,
				default: 1,
			}
		},
		mounted: function () {},
		computed: {
			// 按钮上展示的数字
			pageTextList: function () {
				var totalPage = Math.ceil(this.dataList.length/this.pageNum);

				var step = (this.showPageBtn - 1) / 2;
				var start = (this.currentPage - step) < 1 ? 1 : (this.currentPage - step);
				var end = 0;
				if (1 == start) {
					end = this.showPageBtn;
					if (end > totalPage) {
						end = totalPage;
					}
				} else {
					end = (this.currentPage + step) > totalPage ? totalPage : (this.currentPage + step);
					if (end == totalPage) {
						start = totalPage - this.showPageBtn + 1;
						if (start < 1) {
							start = 1;
						}
					}
				}

				var pageTextList = [];
				// 前...
				if (start > 1) {
					pageTextList.push({
						'text': 		'...',
						'isSelected': 	false,
					});
				}
				for (var i = start; i <= end; i++) {
					var btnInfo = {
						'text': i,
					};
					if (i == this.currentPage) {
						btnInfo['isSelected'] = true;
					} else {
						btnInfo['isSelected'] = false;
					}

					pageTextList.push(btnInfo);
				}
				// 后...
				if (end < totalPage) {
					pageTextList.push({
						'text': 		'...',
						'isSelected': 	false,
					});
				}

				return pageTextList;
			},

			// 计算数据按照this.pageNum能分成几页
			totalPage: function () {
				var totalPage = Math.ceil(this.dataList.length/this.pageNum);

				return totalPage;
			},

			/**
			 * 显示到列表中的数据
			 */
			showDataList: function () {
				// 每页的开始索引。 0为第一个索引
				var start = (this.currentPage - 1) * this.pageNum;
				// 每页结束的下一个索引
				var end = this.currentPage * this.pageNum;

				if (end > this.dataList.length) {
					return this.dataList.slice(start);
				} else {
					return this.dataList.slice(start, end);
				}
			},
		},
		methods: {
			/**
			 * 点击按钮，展示哪一页数据
			 * 0表示去上一页，-1表示去下一页
			 * @param 	Number 	num 	页码
			 */
			toPageData: function (num) {
				// 如果是点击的是当前也，或者..., 则过滤掉
				if (num == this.currentPage || num == '...') {
					return ;
				}

				// 0 表示去上一页。如果是第一页，则不跳转
				if (0 == num) {
					if (1 != this.currentPage) {
						this.currentPage = this.currentPage - 1;
					}
				} else if (-1 == num) { //-1 表示去下一页。如果是最后一页，则不跳转
					if (this.currentPage != this.totalPage) {
						this.currentPage = this.currentPage + 1;
					}
				} else {
					this.currentPage = num;
				}
			},
		},
		watch: {
			// 如果当前每页的展示量变更，且当前页码不为1时，更新当前页码为1
			pageNum: function (newVal, oldVal) {
				if (newVal != oldVal && 1 != this.currentPage) {
					this.currentPage = 1;
				}
			}
		},
	};

	window.Rabbit.Vue.PagingBC = PagingBC;
})(window)