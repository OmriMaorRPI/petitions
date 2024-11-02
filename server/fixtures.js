// Initialize Post Count singleton

if (Singleton.find().count() === 0) {
  Singleton.insert({
    minimumThreshold: 250,
    threshold_updated_at: new Date().getTime()
  });
}

// Add test posts to non-production instances

if (Posts.find().count() === 0 && process.env.NODE_ENV != "production" ) {

  var peteId = Meteor.users.insert({
    username: 'pam3961',
    profile: {
      displayName: 'Pete Mikitsh',
      givenName: 'Pete',
      initials: 'PAM',
      sn: 'Mikitsh',
      name: 'Pete Mikitsh'
    },
    notify: {
      updates: false,
      response: true
    }
  });
  var pete = Meteor.users.findOne(peteId);
  
  // Post with 7-day history

  var postId_seven_day = Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: moment().subtract(7, 'days').valueOf(),
    title: "Build more affordable, on-campus housing.",
    description: "As there is only enough housing for half the student population, it creates a challenge to find affordably priced off-campus housing.",
    upvoters: [pete._id],
    votes: 50,
    minimumVotes: Singleton.findOne().minimumThreshold
  });

  // Post with 3-day history

  var postId_three_day = Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: moment().subtract(3, 'days').valueOf(),
    title: "Extend hours for RIT Computer Labs at peak times.",
    description: "Students often work late near the end of semester; extended lab time will allow more students to utilize this on-campus resource.",
    upvoters: [pete._id],
    votes: 4,
    minimumVotes: Singleton.findOne().minimumThreshold
  });

  // Post with 0-day history

  var postId_no_history = Posts.insert({
    userId: pete._id,
    author: pete.profile.displayName,
    submitted: new Date().getTime(),
    title: "Offer more options for students with unique dietary needs.",
    description: "Increase the number of options for vegan students at on-campus Dining Service locations.",
    upvoters: [pete._id],
    votes: 1,
    minimumVotes: Singleton.findOne().minimumThreshold
  });

  // Extra posts for testing scalability and pagination

  for (var i = 0; i < 10; i++) {
    Posts.insert({
      userId: pete._id,
      author: pete.profile.displayName,
      submitted: new Date().getTime(),
      title: 'Test post #' + i,
      description: "Foo",
      upvoters: [pete._id],
      votes: 1,
      minimumVotes: Singleton.findOne().minimumThreshold
    });
  }

}

// Configure initial admin user

if (Meteor.users.find({username: "sgweb"}).count() === 0) {
  var sgwebId = Meteor.users.insert({
    username: 'sgweb',
    profile: {
      displayName: 'Pete Mikitsh (Student Employee)',
      givenName: 'Pete',
      initials: 'PAM',
      sn: 'Mikitsh',
      name: 'Pete Mikitsh'
    },
    notify: {
      updates: false,
      response: true
    }
  });
  var sgweb = Meteor.users.findOne(sgwebId);
  Roles.addUsersToRoles(sgweb, ['admin']);
}

// Update post count

Singleton.update({}, {$set: {postsCount: Posts.find().count()}});