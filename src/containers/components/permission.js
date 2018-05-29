/*eslint-disable*/
//service 为一个数组，权限的code

import React, { Children, cloneElement, Component, isValidElement } from 'react';
import { observer } from 'mobx-react';
import omit from 'object.omit';
import AppState from '../stores/AppState';
import PermissionStore from '../stores/PermissionStore';

@observer
class Permission extends Component {

  componentWillMount() {
    this.check(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.check(nextProps);
  }

  check(props) {
    PermissionStore.check(this.getPermissionProps(props));
  }

  getPermissionProps(props) {
    const { type: typeState, id, projectId: projectIdState, organizationId: organizationIdState } = AppState.currentMenuType;
    const {
      service,
      type = typeState,
      organizationId = organizationIdState || id,
      projectId = projectIdState || id,
    } = props;
    return {
      service,
      type,
      organizationId,
      projectId,
    };
  }

  extendProps(children, props) {
    return Children.map(children, child => {
      if (isValidElement(child)) {
        return cloneElement(child, props);
      } else {
        return child;
      }
    });
  }

  render() {
    const { defaultChildren, children } = this.props;
    const otherProps = omit(this.props, [
      'service', 'type', 'organizationId', 'projectId', 'defaultChildren', 'children',
    ]);
    if (PermissionStore.judgeServices(this.getPermissionProps(this.props))
        .some(item => PermissionStore.findPermission(item).approve)) {
      return this.extendProps(children, otherProps);
    } else if (defaultChildren) {
      return this.extendProps(defaultChildren, otherProps);
    } else {
      return null;
    }
  }
}


export default Permission;
