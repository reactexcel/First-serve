import React, {
  Component
} from 'react';
import {
  View,
  Image
} from 'react-native';

export default class FixHeightImage extends Component {
    setNativeProps (nativeProps) {
      this._root.setNativeProps(nativeProps);
    }
    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0
        };
    }

    _onLayout(event) {
        const setHeight = this.props.height;

        Image.getSize(this.props.source.uri, (width, height) => {
            this.setState({
                width: setHeight * (width / height),
                height: setHeight
            });
        });
    }

    render() {
        return (
            <View ref={component => this._root = component} onLayout={this._onLayout.bind(this)}>
                <Image
                    source={this.props.source}
                    style={{
                        width: this.state.width,
                        height: this.state.height
                    }} />
            </View>
        );
    }
}
