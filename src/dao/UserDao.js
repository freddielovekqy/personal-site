var UserSchemaModule = require("../model/user.js");
var User = UserSchemaModule.User;
var Education = UserSchemaModule.Education;
var Work = UserSchemaModule.Work;

function save(userDTO) {
    var user = new User({
        email: userDTO.email,
        password: userDTO.password
    });
    return user.save();
}

function findByEmail(email) {
    return User.find({ email: email }).exec();
}

function update(userDTO) {
    var userId = userDTO._id;
    return getById(userId).then(user => {
        user = Object.assign(user, userDTO);
        delete user._id;
        return User.update({'_id': userId}, user);
    });
}

function getById(userId) {
    return User.findById({_id: userId}).exec();
}

function addEducationInfo(userId, educationInfo) {
    console.log('addEducationInfo dao:', userId, educationInfo);
    var educationEntity = new Education({
        schoolType: educationInfo.schoolType,
        schoolName: educationInfo.schoolName,
        inYear: educationInfo.inYear,
        className: educationInfo.className,
        department: educationInfo.department
    });
    console.log("educationEntity", educationEntity);
    return User.update({'_id': userId}, {$addToSet: {'educations': educationEntity}});
}

function updateEducationInfo(userId, educationInfo) {
    var educationEntity = new Education({
        schoolType: educationInfo.schoolType,
        schoolName: educationInfo.schoolName,
        inYear: educationInfo.inYear,
        className: educationInfo.className,
        department: educationInfo.department
    });
    return User.update({'educations._id': educationInfo._id}, {$set: {'educations.$': educationEntity}});
}

function addWorkInfo(userId, workInfo) {
    var workEntity = new Work({
        company: workInfo.company,
        department: workInfo.department,
        startYear: workInfo.startYear,
        endYear: workInfo.endYear,
        location: workInfo.location
    });
    return User.update({'_id': userId}, {$addToSet: {'works': workEntity}});
}

function updateWorkInfo(userId, workInfo) {
    var workEntity = new Work({
        company: workInfo.company,
        department: workInfo.department,
        startYear: workInfo.startYear,
        endYear: workInfo.endYear,
        location: workInfo.location
    });
    return User.update({'works._id': workInfo._id}, {$set: {'works.$': workEntity}});
}

module.exports.save = save;
module.exports.update = update;
module.exports.getById = getById;
module.exports.findByEmail = findByEmail;
module.exports.addEducationInfo = addEducationInfo;
module.exports.updateEducationInfo = updateEducationInfo;
module.exports.addWorkInfo = addWorkInfo;
module.exports.updateWorkInfo = updateWorkInfo;