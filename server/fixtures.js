if (People.find().count() === 0){
    People.insert({
        img_path: 'images/adolf_hitler.jpg',
        name: 'Adolf Hitler'
    });
    People.insert({
        img_path: 'images/george_w_bush.jpg',
        name: 'George W Bush'
    });
}
