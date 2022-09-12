// import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";

function DefaultHeaderBarOption ({ route, title }) {

    let _title;
    switch(title) {
        case undefined:
            _title = route.name
          break;
        case title:
            _title = title
          break;
        default:
            _title = ''
      }

    return {
        headerShadowVisible: true,
        headerStyle: Styles.defaultHeaderBarStyle,
        headerTitleStyle: Styles.defaultHeaderBarTitleStyle,
        headerTitleAlign:'center',
        title:(!!title ? title : '' ),
    };
};

export default DefaultHeaderBarOption;