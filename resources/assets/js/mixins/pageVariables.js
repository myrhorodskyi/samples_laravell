export default {

  data() {
    return {
      variables: {}
    }
  },

  created() {
    this.variables = _.clone(this.pageVariables);
    this.updateVariablesFromUrl();
  },

  methods: {
    resetPageVariables(){
      _.each(this.constants, (value, key) => {
        this.variables[key] = value.defaultValue;
      });
      this.updatePageVariables();
    },
    updatePageVariables() {
      this.setPageVariables(this.variables).then((res) => {
        this.handlePageVariablesUpdate(res);
      });
    },
    handlePageVariablesUpdate(changes) {
      //..
    },
    updatePageVariable(variable, value) {
      this.variables[variable] = value;
      this.updatePageVariables();
    },
    updateVariablesFromUrl() {
      let param, value;

      for (param in this.$route.query) {
        value = this.$route.query[param];

        if (this.variables[param] !== undefined && value) {
          this.variables[param] = value;
        }
      }

      this.updatePageVariables();
    },
    getStatusValue() {return this._getMultiselectValue('status');},
    setStatusValue(option) {this._setMultiselectValue('status', option);},

    getSortValue() {return this._getMultiselectValue('sort');},
    setSortValue(option) {this._setMultiselectValue('sort', option);},

    getTypeValue() {return this._getMultiselectValue('type');},
    setTypeValue(option) {this._setMultiselectValue('type', option);},

    _getMultiselectValue(variable) {
      return _.find(this.constants[variable].options, {value: this.variables[variable]});
    },

    _setMultiselectValue(variable, option) {
      if (option) {
        this.updatePageVariable(
          variable,
          option ? option.value : this._getDefaultValueFor(variable)
        );
      }
    },

    _getDefaultValueFor(variable) {
      return this.constants[variable].defaultValue;
    }
  }
}
