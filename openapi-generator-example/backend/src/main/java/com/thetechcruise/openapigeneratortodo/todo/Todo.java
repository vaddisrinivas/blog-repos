package com.thetechcruise.openapigeneratortodo.todo;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.format.annotation.DateTimeFormat;

@Data // <--- this annotation generates getters, setters, toString, equals and hashCode methods
@NoArgsConstructor // <--- this annotation generates a no-args constructor
@AllArgsConstructor
@Setter
@Getter
@JsonPropertyOrder(alphabetic = true)
@Document(collection = "todo")
public class Todo {

    @MongoId
    @ReadOnlyProperty
    private String id;
    @NotNull
    private Boolean completed;

    @NotNull
    @Min(0)
    @Max(4)
    private Integer priority;

    @Size(min = 0, max = 32)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private String completionDate;

    @NotNull
    @Size(min = 0, max = 32)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private String creationDate;

    @NotBlank
    @Size(min = 5, max = 200)
    private String note;

    @NotBlank
    @Size(min = 1, max = 255)
    private String title;

    @Size(min = 0, max = 1000)
    private String description;

    @Size(min = 0, max = 10)
    private List<@NotBlank @Size(min = 1, max = 32) String> project;

    @Size(min = 0, max = 10)
    private List<@NotBlank @Size(min = 1, max = 32) String> tags;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private String due;

    @Size(min = 0, max = 4)
    private List<@Email String> share;

    @Size(min = 0, max = 4)
    private List<@Pattern(regexp="^(https?|ftp)://[^\\s/$.?#].[^\\s]*$") String> images;

    @Size(min = 0, max = 4)
    private List<@Pattern(regexp="^(https?|ftp)://[^\\s/$.?#].[^\\s]*$") String> references;

    @Size(min = 0, max = 4)
    private List<@Pattern(regexp="^(https?|ftp)://[^\\s/$.?#].[^\\s]*$") String> related;

    @Size(min = 0, max = 4)
    private List<@Pattern(regexp="^(https?|ftp)://[^\\s/$.?#].[^\\s]*$") String> attachment;

    @Min(0)
    @Max(9999)
    private Integer estimate;

    @NotBlank
    @Size(min = 1, max = 255)
    private String user;

    private Urgence urgence;

    private Significance significance;

    private Importance importance;

    @Pattern(regexp="^(\\*|[0-9]+[hdm])+$")
    private String repeat;

    @NotBlank
    @Size(min =1, max=255)
    private String context;

    @Size(min=0,max=4)
    private List<@Email String> assignedTo;

    private Boolean inProgress;


}

enum Urgence {
    LOW,
    MEDIUM,
    HIGH
}

enum Significance {
    LOW,
    MEDIUM,
    HIGH
}

enum Importance {
    LOW,
    MEDIUM,
    HIGH
}
