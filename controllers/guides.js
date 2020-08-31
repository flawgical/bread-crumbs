const Guide = require('../models/guides');

function index(req, res) {
  Guide.find({}, null, function(err, guides) {
    const actions = [];
    guides.forEach(el => {
      if (!actions.find(target => target === el.action)) {actions.push(el.action)}
    })
    const components = [];
    guides.forEach(el => {
      if (!components.find(target => target === el.app_component)) {components.push(el.app_component)}
    })
    res.render('guides/index', {title: 'Guides', user: req.user, actions, components});
  })
}

function newGuide(req, res) {
  res.render('guides/new', {title: 'Enter Title', user: req.user})
}

function create(req, res) {
  req.body.slug = `${req.body.action}-${req.body.app_component}`.toLowerCase()
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  Guide.create(req.body)
  .then(guide => {
      console.log(guide);
      res.redirect('/guides');//should redirect to show to add steps
  })
  .catch( err => {
      console.log(err);
      res.redirect('/guides');
  })
}

function search(req, res) {
  const slug = `${req.query.action}-${req.query.app_component}`.toLowerCase();
  res.redirect(`/guides/${slug}`);
}

function show(req, res) {
  Guide.find({slug: req.params.id}, null, function(err, guide){
    if(guide.length < 1){
      res.redirect('/guides')//library later on with could not find message
    } else {
    res.render('guides/show', {title: 'test', guide, user: req.user})
    }
  })
}

function addStep(req ,res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  Guide.findById(req.params.id)
    .then(guide => {
      guide.steps.push(req.body);
      guide.save(function(err){
        res.redirect(`/guides/${guide.slug}`)
      })
    })
}

function removeStep(req, res) {
  Guide.findById(req.params.id)
    .then(guide => {
      console.log(guide)
      const idx = guide.steps.findIndex(el => el._id === req.params.stepId);
      guide.steps.splice(idx,1);
      guide.save(function(err){
        res.redirect(`/guides/${guide.slug}`)
      })
    })
}

module.exports = {
  index,
  new: newGuide,
  create,
  search,
  show,
  addStep,
  removeStep
};