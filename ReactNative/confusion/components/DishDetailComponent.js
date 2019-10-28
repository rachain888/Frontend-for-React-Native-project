/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
/* import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments'; */
import { baseUrl } from '../shared/baseurl';
import { Loading } from './LoadingComponent';
import {
  fetchDishes,
  fetchComments,
  postFavorite,
} from '../Redux/Api/ActionCreators';

const mapStateToProps = state => ({
  dishes: state.dishes,
  comments: state.comments,
  favorites: state.favorites,
});

const mapDispatchToProps = dispatch => ({
  fetchDishes: dispatch(fetchDishes()),
  fetchComments: dispatch(fetchComments()),
  postFavorite: dishId => dispatch(postFavorite(dishId)),
});

const formatter = new Intl.DateTimeFormat('en-GB');

function RenderComments(props) {
  const { comments } = props;

  const renderCommentItem = ({ item, key }) => (
    <View key={key} style={{ margin: 10 }}>
      <Text style={{ fontSize: 14 }}>{item.comment}</Text>
      <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
      <Text style={{ fontSize: 12 }}>
        {`-- ${item.author}, ${formatter.format(Date.parse(item.date))}`}
      </Text>
    </View>
  );

  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

RenderComments.propTypes = {
  // // WTF?
  /*   item: PropTypes.array.isRequired, */
  comments: PropTypes.array.isRequired,
  key: PropTypes.number.isRequired,
  item: PropTypes.array.isRequired,
};

function RenderDish(props) {
  // Setting the const dish as our passed down props.

  /* console.log(`THESE ARE THE PROPS IN RENDERDISH ${JSON.stringify(props)}`); */
  // Conditional rendering.
  const { dish } = props;
  if (dish != null) {
    /* console.log(
      ` THESE ARE THE PROPS INSIDE DISHDETAILCOMPONENT ${JSON.stringify(props)}`
    ); */

    console.log('We are here');
    return (
      <Card
        featuredTitle={dish.name}
        // eslint-disable-next-line global-require
        image={{ uri: baseUrl + dish.image }}
      >
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <Icon
          raised
          reverse
          name={props.favorite ? 'heart' : 'heart-o'}
          type="font-awesome"
          color="#f50"
          onPress={() =>
            props.favorite ? console.log('Already favorite') : props.onPress()
          }
        />
      </Card>
    );
  }

  return <View></View>;
}

RenderDish.propTypes = {
  // // WTF?
  /*   item: PropTypes.array.isRequired, */
  dish: PropTypes.array.isRequired,
  favorite: PropTypes.array.isRequired,
  onPress: PropTypes.array.isRequired,
};

class DishDetail extends Component {
  markFavorite(dishId) {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.postFavorite(dishId);
  }

  static navigationOptions = {
    title: 'Dish Details',
  };

  render() {
    // showing which dish to show based on the ID passed in from menucomponent
    // This.props.navigation are passed in to all components in my navigator,
    // We have access here to the getParam(), which allows us to access the parameters that are passed in.

    // Passing props to our function and returning it as the view for our component here..
    // this.state.dishes is a javascript object array so we have to specifically select the dish we want.
    // The plus here means that since this will be a string that is passed in i am going to turn that into a number.

    // eslint-disable-next-line react/destructuring-assignment
    const dishId = this.props.navigation.getParam('dishId', '');

    /*     console.log(
          `THESE ARE OUR DISHES PROPS ${JSON.stringify(this.props.dishes.dishes)}`
        ); */

    if (this.props.dishes.isLoading) {
      return <Loading />;
    }
    if (this.props.dishes.errMess) {
      return <Text>{this.props.dishes.errMess}</Text>;
    }
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.dishes.dishes.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
      </ScrollView>
    );
  }
}

DishDetail.propTypes = {
  // // WTF?
  /*   item: PropTypes.array.isRequired, */
  dishes: PropTypes.array.isRequired,
  navigation: PropTypes.array.isRequired,
  comments: PropTypes.array.isRequired,
  postFavorite: PropTypes.array.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DishDetail);
