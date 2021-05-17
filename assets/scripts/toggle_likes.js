class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }
    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();

            let self = this;
            //console.log(self);

            $.ajax({
                type : 'POST',
                url : $(self).attr('href')
            })
            .done(function(data){

                let likesCount = parseInt($(self).attr('data-likes'));
                //console.log(likesCount);

                if(data.data.deleted == true){
                    likesCount = likesCount-1;

                }else{
                    likesCount = likesCount+1;
                }

                $(self).attr('data-likes',likesCount);
                $(self).html(`${likesCount} Likes`)


            })
            .fail(function(errData){
                console.log("error in completing the request");
            })

        })
    }

}