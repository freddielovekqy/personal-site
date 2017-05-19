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
    return User.findOne({ email: email }).exec();
}

function update(userDTO) {
    var userId = userDTO._id;
    return getById(userId).then(user => {
        user = Object.assign(user, userDTO);
        delete user._id;
        return User.update({'_id': userId}, user);
    });
}

function updateUserAttr(userId, userAttr) {
    return User.update({_id: userId}, {$set: userAttr});
}

function getById(userId) {
    return User.findById(userId, {password: 0}).exec();
}

function getPassword(userId) {
    return User.findById(userId, {password: 1}).lean().exec();
}

function getBasicUserInfo(userId) {
    return User.findById(userId, {hobby: 0, educations: 0, works: 0, password: 0}).exec();
}

function addEducationInfo(userId, educationInfo) {
    var educationEntity = new Education({
        schoolType: educationInfo.schoolType,
        schoolName: educationInfo.schoolName,
        inYear: educationInfo.inYear,
        className: educationInfo.className,
        department: educationInfo.department
    });
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

function deleteEducationInfo(userId, educationId) {
    return User.update({_id: userId}, {$pull: {educations: {_id: educationId}}});
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

function deleteWorkInfo(userId, workId) {
    return User.update({_id: userId}, {$pull: {works: {_id: workId}}});
}

module.exports.save = save;
module.exports.update = update;
module.exports.updateUserAttr = updateUserAttr;
module.exports.getById = getById;
module.exports.getPassword = getPassword;
module.exports.getBasicUserInfo = getBasicUserInfo;
module.exports.findByEmail = findByEmail;
module.exports.addEducationInfo = addEducationInfo;
module.exports.updateEducationInfo = updateEducationInfo;
module.exports.deleteEducationInfo = deleteEducationInfo;
module.exports.addWorkInfo = addWorkInfo;
module.exports.updateWorkInfo = updateWorkInfo;
module.exports.deleteWorkInfo = deleteWorkInfo;