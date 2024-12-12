package com.amardeep.VaultNote.repositories;

import com.amardeep.VaultNote.models.AppRole;
import com.amardeep.VaultNote.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(AppRole appRole);
}
