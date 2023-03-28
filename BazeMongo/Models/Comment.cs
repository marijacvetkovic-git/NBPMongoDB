using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace Models
{
    public class Comment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string CID {get; set;}
        public string? Text {get; set;}
        public DateTime DateOfCreation { get; set; }
        public string? CommentStudent { get; set; } 
        public string? CommentProfessor { get; set; } 
        
       public override bool Equals(object obj)
    {
        if (obj == null || GetType() != obj.GetType())
        {
            return false;
        }

        Comment otherComment = (Comment)obj;
        return CID == otherComment.CID;
    }

    public override int GetHashCode()
    {
        return CID.GetHashCode();
    }

    
    }
}